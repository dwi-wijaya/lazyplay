export const getVideoDetails = async (videoID) => {
    try {
        const videoApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${import.meta.env.VITE_GOOGLE_API_KEY}&part=snippet,contentDetails`
        const videoResponse = await fetch(videoApiUrl)
        if (!videoResponse.ok) {
            throw new Error('Failed to fetch video details')
        }
        const videoData = await videoResponse.json()

        if (!videoData.items || videoData.items.length === 0) {
            throw new Error('Video not found')
        }

        const video = videoData.items[0]
        const artistName = parseArtist(video.snippet)
        const channelId = video.snippet.channelId


        // Get channel details
        const channel = await getChannelDetails(channelId)

        return {
            title: video.snippet.title,
            duration: video.contentDetails.duration,
            thumbnail: video.snippet.thumbnails.high.url,
            channelTitle: artistName,
            channelImage: channel.snippet.thumbnails.high.url
        }
    } catch (error) {
        console.error('Error fetching video details:', error.message)
        return null
    }
}

export const parseArtist = (videoSnippet) => {
    let artistName = ''

    const channelTitle = videoSnippet.channelTitle
    const lowerCaseArtist = channelTitle.toLowerCase();

    if (lowerCaseArtist.includes('vevo') || lowerCaseArtist.includes('topic')) {

        // Use video title or artist name to extract artist name
        const title = lowerCaseArtist.includes('vevo') ? videoSnippet.title : channelTitle
        const titleParts = title.split('-')

        if (titleParts.length > 1) {
            artistName = titleParts[0].trim()
        } else {
            artistName = videoSnippet.channelTitle.trim()
        }

    } else {
        artistName = channelTitle.trim()
    }

    return artistName
}

export const getChannelDetails = async (channelId) => {

    const channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${import.meta.env.VITE_GOOGLE_API_KEY}&part=snippet`
    const channelResponse = await fetch(channelApiUrl)

    if (!channelResponse.ok) {
        throw new Error('Failed to fetch channel details')
    }
    const channelData = await channelResponse.json()

    if (!channelData.items || channelData.items.length === 0) {
        throw new Error('Channel not found')
    }

    return channelData.items[0]
}

export const extractVideoID = (url) => {

    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regExp)

    return (match && match[1]) || null
}