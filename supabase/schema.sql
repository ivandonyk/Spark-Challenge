-- normalized_url stored separately to preserve original input while deduping
create table assets (
  id             uuid primary key default gen_random_uuid(),
  url            text not null,
  normalized_url text not null unique,
  platform       text not null check (platform in ('youtube', 'instagram', 'tiktok')),
  thumbnail_url  text,
  title          text,
  created_at     timestamptz not null default now()
);

-- descending index targets grid display sorted by newest first
create index idx_assets_created_at on assets (created_at desc);

create table tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

insert into tags (name) values
  ('Motion'),
  ('Typography'),
  ('Color'),
  ('Sound design');

-- composite PK prevents duplicate tag assignments; cascading deletes keep junction clean
create table asset_tags (
  asset_id uuid not null references assets (id) on delete cascade,
  tag_id   uuid not null references tags (id) on delete cascade,
  primary key (asset_id, tag_id)
);

create index idx_asset_tags_asset_id on asset_tags (asset_id);
create index idx_asset_tags_tag_id on asset_tags (tag_id);

-- view eliminates N+1 queries — single query returns assets with aggregated tags
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
