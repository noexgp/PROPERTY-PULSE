import connectdDB from '@/config/database'
import Property from '@/models/Property'
import { getSessionUser } from '@/utils/getSessionUser'
import cloudinary from '@/config/cloudinary'

//GET /api/properties
export const GET = async (request) => {
  try {
    await connectdDB()
    const page = request.nextUrl.searchParams.get('page') || 1
    const pageSize = request.nextUrl.searchParams.get('pageSize') || 6

    const skip = (page - 1) * pageSize

    const total = await Property.countDocuments({})

    const properties = await Property.find({}).skip(skip).limit(pageSize)

    const result = {
      total,
      properties,
    }

    return new Response(JSON.stringify(result), {
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return new Response('Something Went Wrong', { status: 500 })
  }
}

export const POST = async (request) => {
  try {
    await connectdDB()

    const sessionUser = await getSessionUser()
    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 })
    }

    const { userId } = sessionUser

    const formData = await request.formData()
    // Access all values from amenities and images
    const amenities = formData.getAll('amenities') // Corrected typo
    const images = formData
      .getAll('images')
      .filter((image) => image.name !== '')
    //Create properties object for database
    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'), // Corrected property name to 'description'
      location: {
        street: formData.get('location.street'), // Enclosed property names in quotes
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode'),
      },
      beds: formData.get('beds'),
      baths: formData.get('baths'),
      square_feet: formData.get('square_feet'),
      amenities,
      rates: {
        weekly: formData.get('rates.weekly'), // Enclosed property names in quotes
        nightly: formData.get('rates.nightly'),
        monthly: formData.get('rates.monthly'),
      },
      seller_info: {
        name: formData.get('seller_info.name'), // Enclosed property names in quotes
        email: formData.get('seller_info.email'),
        phone: formData.get('seller_info.phone'),
      },
      owner: userId,
    }

    //upload images to cloudinary
    const imageUploadPromises = []

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer()
      const imageArray = Array.from(new Uint8Array(imageBuffer))
      const imageData = Buffer.from(imageArray)

      //Convert the image to base64
      const imageBase64 = imageData.toString('base64')

      //Make request to upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: 'propertypulse',
        }
      )
      imageUploadPromises.push(result.secure_url)
      //wait for all images to upload
      const uploadedImages = await Promise.all(imageUploadPromises)
      //Add uploaded images to the propertyData object
      propertyData.images = uploadedImages
    }

    const newProperty = new Property(propertyData)
    await newProperty.save()

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    )

    // Return a success response
    // return new Response(JSON.stringify({ message: 'Success' }), { status: 200 }) // Corrected JSON syntax
  } catch (error) {
    console.error('Failed to add property:', error) // Log the error for debugging
    return new Response('Failed to add property', { status: 500 })
  }
}
