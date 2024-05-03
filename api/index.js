/** handler - Function that AWS Lambda calls on API trigger*/
exports.handler = async (event) => {
  console.info("🚀 ~ file: index.js ~ line 3 ~ exports.handler= ~ event", event);
  if (!event.queryStringParameters) {
    return {
      statusCode: 422,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Invalid request" }),
    };
  }

  try {
    const processedData =
      /*Using event.queryStringParameters, do some process / call third party API of your app*/
      event.queryStringParameters;
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processedData),
    };
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
