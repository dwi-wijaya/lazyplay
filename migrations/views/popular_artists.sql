-- public.popular_artists source

CREATE
OR REPLACE VIEW public.popular_artists AS
SELECT
    count(*) AS count_artist,
    songs.artist,
    min(songs.artist_image) AS artist_image
FROM
    songs
WHERE
    songs.status = 0
GROUP BY
    songs.artist
ORDER BY
    (count(*)) DESC;