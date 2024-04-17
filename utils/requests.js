const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null

//Fetch all Properties
async function fetchProperties({ showFeatured = false } = {}) {
  try {
    //handle the case where the domain is null
    if (!apiDomain) {
      return []
    }

    const res = await fetch(
      `${apiDomain}/properties${showFeatured ? '/featured' : ''}`,
      { cache: 'no-store' }
    )
    if (!res.ok) {
      throw new Error('Failed to ferched data')
    }
    return res.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

//Fetch single property
async function fetchProperty(id) {
  try {
    //handle the case where the domain is null
    if (!apiDomain) {
      return null
    }

    const res = await fetch(`${apiDomain}/properties/${id}`)
    if (!res.ok) {
      throw new Error('Failed to fetched data')
    }
    return res.json()
  } catch (error) {
    console.log(error)
    return null
  }
}

export { fetchProperties, fetchProperty }
