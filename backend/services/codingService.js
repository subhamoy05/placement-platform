const axios = require("axios");

const executePythonCode = async ({
  code,
  testCases,
}) => {
  try {
    const response = await axios.post(
      `${process.env.CODING_ENGINE_URL}/execute`,
      {
        code,
        testCases,
      },
      {
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Python execution service error:",
      error.message
    );

    throw new Error(
      "Python coding engine is unavailable"
    );
  }
};

module.exports = {
  executePythonCode,
};