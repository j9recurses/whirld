
json.array!([@item) do |json, item|
 json.id                          item.id
  json.name      item.name
  json.taggable_id     item.taggable_id
  json.taggable_type  item.taggable_type
end
