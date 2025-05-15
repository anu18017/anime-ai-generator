// Firebase config (replace with your project config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const DAILY_FREE_CREDITS = 5;

const loginBtn = document.getElementById("google-login");
const logoutBtn = document.getElementById("logout");
const userInfo = document.getElementById("user-info");
const userName = document.getElementById("user-name");

loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});
logoutBtn.addEventListener("click", () => auth.signOut());

auth.onAuthStateChanged(async user => {
  if (user) {
    loginBtn.style.display = "none";
    userInfo.style.display = "block";
    userName.textContent = `Hello, ${user.displayName}`;

    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();
    const today = new Date().toISOString().split('T')[0];

    if (!doc.exists) {
      await userRef.set({ credits: DAILY_FREE_CREDITS, lastClaimedDate: today });
    } else {
      const data = doc.data();
      if (data.lastClaimedDate !== today) {
        await userRef.update({ credits: DAILY_FREE_CREDITS, lastClaimedDate: today });
      }
    }

    const userData = (await userRef.get()).data();
    document.getElementById("credit-info").textContent = `You have ${userData.credits} credits left today.`;

    document.getElementById("generate").addEventListener("click", async () => {
      const prompt = document.getElementById("prompt").value.trim();
      if (!prompt) return alert("Please enter a prompt.");

      const docSnap = await userRef.get();
      const { credits } = docSnap.data();
      if (credits <= 0) return alert("You’ve used your free credits for today.");

      await userRef.update({ credits: credits - 1 });
      document.getElementById("credit-info").textContent = `You have ${credits - 1} credits left today.`;

      document.getElementById("loading").style.display = "block";
      document.getElementById("output").innerHTML = "";

      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const result = await response.json();
      const predictionUrl = result?.urls?.get;

      const poll = async () => {
        const res = await fetch(predictionUrl, {
          headers: { Authorization: `Token YOUR_REPLICATE_API_TOKEN` }
        });
        const data = await res.json();
        if (data.status === "succeeded") {
          document.getElementById("loading").style.display = "none";
          document.getElementById("output").innerHTML = `<img src="${data.output[0]}" width="256" style="border-radius:12px" />`;
        } else if (data.status === "processing") {
          setTimeout(poll, 1500);
        } else {
          document.getElementById("loading").style.display = "none";
          alert("Generation failed.");
        }
      };
      poll();
    });
  } else {
    loginBtn.style.display = "inline-block";
    userInfo.style.display = "none";
  }
});
