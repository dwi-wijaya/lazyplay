-- public.popular_songs source

CREATE
OR REPLACE VIEW public.popular_songs AS
SELECT
    count(*) AS count_song,
    s.url,
    s.status,
    s.title,
    s.duration,
    s.thumbnail,
    s.artist,
    s.artist_image
FROM
    songs s
WHERE
    s.status = 0
GROUP BY
    s.url,
    s.status,
    s.title,
    s.duration,
    s.thumbnail,
    s.artist,
    s.artist_image
ORDER BY
    (count(*)) DESC;