let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: "ec2-54-170-190-29.eu-west-1.compute.amazonaws.com",
    database: "d3p3po5294tocd",
    user: "khelrcnrjognzd",
    password: "7ae89722f11fada07e27ada78efaa508443421a8b76a91e5a19e36a173758400",
    port: 5432
  };
}

export { config }; 