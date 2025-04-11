const { db, auth } = require("./firebase");


const testFirestore = async () => {
  try {
    const docRef = await db.collection("waste").add({
      type: "vegetables",
      quantity: 50,
      location: "Toronto",
    });
    console.log("Waste logged with ID: ", docRef.id);
  } catch (error) {
    console.error("Error logging waste: ", error);
  }
};

// testing Authentication
const testAuth = async () => {
  try {
    const user = await auth.createUser({
      email: "cc2025@mail.com",
      password: "abc2333",
    });
    console.log("User created with UID: ", user.uid);
  } catch (error) {
    console.error("Error creating user: ", error);
  }
};

// running the tests
const runTests = async () => {
  console.log("Testing Firestore...");
  await testFirestore();

  console.log("Testing Authentication...");
  await testAuth();
};

runTests();