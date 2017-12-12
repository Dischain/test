server.h

Тут описываются основные структуры данных, используемые для реализации Redis Data Types

#include "sds.h"     /* Dynamic safe strings */
#include "dict.h"    /* Hash tables */
#include "adlist.h"  /* Linked lists - doubly linked list */
#include "ziplist.h" /* Compact list data structure - doubly linked list - optimized
                        to be very memory efficient */
#include "intset.h"  /* Compact integer set structure */
#include "quicklist.h" /* A generic doubly linked quicklist implementation */

Далее идут основные настройки (настройки сервера опускаем)

/* Hash table parameters */
#define HASHTABLE_MIN_FILL        10      /* Minimal hash table fill 10% */
/* List related stuff */
#define LIST_HEAD 0
#define LIST_TAIL 1
/* Skip List related stuff */
#define ZSKIPLIST_MAXLEVEL 32 /* Should be enough for 2^32 elements */
#define ZSKIPLIST_P 0.25      /* Skiplist P = 1/4 */
/* Zip structure related defaults */
#define OBJ_HASH_MAX_ZIPLIST_ENTRIES 512
#define OBJ_HASH_MAX_ZIPLIST_VALUE 64
#define OBJ_SET_MAX_INTSET_ENTRIES 512
#define OBJ_ZSET_MAX_ZIPLIST_ENTRIES 128
#define OBJ_ZSET_MAX_ZIPLIST_VALUE 64
/* Sets operations codes */
#define SET_OP_UNION 0
#define SET_OP_DIFF 1
#define SET_OP_INTER 2

/* A redis object, that is a type able to hold a string / list / set */
/* The actual Redis Object */
#define OBJ_STRING 0    /* String object. */
#define OBJ_LIST 1      /* List object. */
#define OBJ_SET 2       /* Set object. */
#define OBJ_ZSET 3      /* Sorted set object. */
#define OBJ_HASH 4      /* Hash object. */

/* Objects encoding. Some kind of objects like Strings and Hashes can be
 * internally represented in multiple ways. The 'encoding' field of the object
 * is set to one of this fields for this object. */
#define OBJ_ENCODING_RAW 0     /* Raw representation */
#define OBJ_ENCODING_INT 1     /* Encoded as integer */
#define OBJ_ENCODING_HT 2      /* Encoded as hash table */
#define OBJ_ENCODING_ZIPMAP 3  /* Encoded as zipmap */
#define OBJ_ENCODING_LINKEDLIST 4 /* No longer used: old list encoding. */
#define OBJ_ENCODING_ZIPLIST 5 /* Encoded as ziplist */
#define OBJ_ENCODING_INTSET 6  /* Encoded as intset */
#define OBJ_ENCODING_SKIPLIST 7  /* Encoded as skiplist */
#define OBJ_ENCODING_EMBSTR 8  /* Embedded sds string encoding */
#define OBJ_ENCODING_QUICKLIST 9 /* Encoded as linked list of ziplists */
#define OBJ_ENCODING_STREAM 10 /* Encoded as a radix tree of listpacks */

Описание redis object.
The following is the full `robj` structure, which defines a *Redis object*:

typedef struct redisObject {
    unsigned type:4;
    unsigned encoding:4;
    unsigned lru:LRU_BITS; /* lru time (relative to server.lruclock) */
    int refcount;
    void *ptr;
} robj;

Описание redis operation:

/* The redisOp structure defines a Redis Operation, that is an instance of
 * a command with an argument vector, database ID, propagation target
 * (PROPAGATE_*), and command pointer.
 *
 * Currently only used to additionally propagate more commands to AOF/Replication
 * after the propagation of the executed command. */
typedef struct redisOp {
    robj **argv;
    int argc, dbid, target;
    struct redisCommand *cmd;
} redisOp;

Описание redisDb (см. )

/* Redis database representation. There are multiple databases identified
 * by integers from 0 (the default database) up to the max configured
 * database. The database number is the 'id' field in the structure. */
typedef struct redisDb {
    dict *dict;                 /* The keyspace for this DB */
    dict *expires;              /* Timeout of keys with a timeout set */
    dict *blocking_keys;        /* Keys with clients waiting for data (BLPOP)*/
    dict *ready_keys;           /* Blocked keys that received a PUSH */
    dict *watched_keys;         /* WATCHED keys for MULTI/EXEC CAS */
    int id;                     /* Database ID */
    long long avg_ttl;          /* Average TTL, just for stats */
} redisDb;

Описание ZSET:

/* ZSETs use a specialized version of Skiplists */
typedef struct zskiplistNode {
    sds ele;
    double score;
    struct zskiplistNode *backward;
    struct zskiplistLevel {
        struct zskiplistNode *forward;
        unsigned int span;
    } level[];
} zskiplistNode;

typedef struct zskiplist {
    struct zskiplistNode *header, *tail;
    unsigned long length;
    int level;
} zskiplist;

typedef struct zset {
    dict *dict;
    zskiplist *zsl;
} zset;

Таким образом, имеем:
1. Redis Data Types реализованы в файлах: t_hash.c t_list.c t_set.c t_string.c t_zset.c
2. Все они хранятся в структуре redisDb, которая содержит в качестве своего поля dict c
   именами всех структур данных.
3. Каждые из этих типов реализован с использованием некоторых структур данных:
  - HASH - в зависимости от кодировки, может быть использован ziplist (если кодировка
  redisObject соответствует REDIS_ENCODING_ZIPLIST либо если количество элементов превышает
  значение hash-max-ziplist-entries) либо dict (кодировка REDIS_ENCODING_HT). В качестве
  ключей использует sds.
  - LIST - реализовн с использованием quicklist, всегда проверяет кодировку robject`a на
  значение OBJ_ENCODING_QUICKLIST.
  - SET - в зависимости от кодировки, может использовать dict (REDIS_ENCODING_HT) либо
  intset (OBJ_ENCODING_INTSET, который реализовн как обычный массив с кодировкой типов целых).
  - ZSET - использует две структуры данных для хранения одинаковых элементов, чтобы иметь
  возможность вставки и удаления за O(log(N)): hash table и skiplist (структура его описана
  в server.h, реализация - t_zset.c). В качестве hash table использует либо dict, либо ziplist.