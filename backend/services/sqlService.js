const axios = require("axios");

const executeSQL = async ({
  schema,
  sampleData,
  query,
}) => {
  try {
    const response = await axios.post(
      `${process.env.SQL_ENGINE_URL}/execute`,
      {
        schema,
        sampleData,
        query,
      },
      {
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "SQL execution service error:",
      error.message
    );

    throw new Error(
      "SQL execution service is unavailable"
    );
  }
};

module.exports = {
  executeSQL,
};