import connectdDB from '@/config/database'
import Property from '@/models/Property'

//GET /api/properties/featured
export const GET = async (request) => {
  try {
    await connectdDB()

    const properties = await Property.find({
      is_featured: true,
    })

    return new Response(JSON.stringify(properties), {
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return new Response('Something Went Wrong', { status: 500 })
  }
}
