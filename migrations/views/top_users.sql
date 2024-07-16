-- public.top_users source

CREATE 
OR REPLACE VIEW public.top_users AS 
SELECT 
    count(*) AS top_user,
    s.created_by,
    u.raw_user_meta_data ->> 'full_name'::text AS created_name,
    u.raw_user_meta_data
FROM songs s
JOIN auth.users u ON u.id::text = s.created_by
GROUP BY s.created_by, u.raw_user_meta_data
ORDER BY (count(*)) DESC;