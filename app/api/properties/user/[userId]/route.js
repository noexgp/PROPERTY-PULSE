import connectdDB from '@/config/database'
import Property from '@/models/Property'

//GET /api/properties
export const GET = async (request, { params }) => {
  try {
    await connectdDB()

    const userId = params.userId

    if (!userId) {
      return new Response('User ID is required', { status: 400 })
    }

    const properties = await Property.find({ owner: userId })

    return new Response(JSON.stringify(properties), {
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return new Response('Something Went Wrong', { status: 500 })
  }
}
