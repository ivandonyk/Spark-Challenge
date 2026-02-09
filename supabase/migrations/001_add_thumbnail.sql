alter table assets add column thumbnail_url text;
alter table assets add column title text;

create or replace view assets_with_tags as
select
  a.id,
  a.url,
  a.normalized_url,
  a.platform,
  a.thumbnail_url,
  a.title,
  a.created_at,
  coalesce(
    array_agg(t.name order by t.name) filter (where t.name is not null),
    '{}'
  ) as tags
from assets a
left join asset_tags at on a.id = at.asset_id
left join tags t on at.tag_id = t.id
group by a.id;
