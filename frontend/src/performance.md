## Column Definitions

| Column | Definition |
|--------| -----------|
| `id`   | The query step number |
| `select_type`| The type of SELECT, with SIMPLE meaning no subqueries |
| `table` | The table that this row refers to |
| `partitions` | Which partitions were searched, NULL meaning that the table is not partitioned |
| `type `| How MySQL scans the table, ALL meaning a full table scan |
| `possible_keys` | Indexes that MySQL considered using, NULL being none |
| `key` | The index that MySQL chose, NULL being none |
| `key_len` | The number of bytes used from the chosen index |
| `ref` | The value being compared to the index, which can be a constant, column, or NULL |
| `rows` | An estimate of the number of rows to examine |
| `filtered` | Estimated percentage of rows passing the WHERE clause; lower means more rows are being filtered out |
| `Extra` | Additional information, such as `Using index` or `Using where` |

## Improvements

Several new indexes were added that account for various combinations of filter options, such as city/status/price, city/beds/price, and status/type/price, including an exhaustive index that encompasses all filters.

This significantly decreased retrieving property data from an average of 15-17 seconds to around 1-2 seconds.