let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: "kandula.db.elephantsql.com",
    database: "zczukuha",
    user: "zczukuha",
    password: "FK8tGoTvdEy1m5UqyT8VTtWIIY2r3pqi",
    port: 5432
  };
}

export { config }; 