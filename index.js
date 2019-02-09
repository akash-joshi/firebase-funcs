const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.lmao = functions.https.onRequest(async (req, res) => {
  const snap = await db
    .collection("2019")
    .doc("January")
    .get();

  res.send(snap.data());
});

exports.getScore = functions.https.onRequest(async (req, res) => {
  const month = "January";
  const snap = await db
    .collection("2018")
    .doc(month)
    .collection("Reports")
    .get();
  snap.forEach(async doc => {
    const data = doc.data();
    const { areaX, areaY } = data;
    const score = await db
      .collection("2018")
      .doc(month)
      .collection("areaScores")
      .doc(`${areaX},${areaY}`)
      .get();
    let scoreDat = score.data();
    let scoreData;
    if (!scoreDat) scoreData = 10;
    else scoreData = scoreDat.scoreData;
    scoreData--;
    db.collection("2018")
      .doc(month)
      .collection("areaScores")
      .doc(`${areaX},${areaY}`)
      .set({ scoreData });
  });
  res.send("ok");
});

exports.getPriority = functions.https.onRequest(async (req, res) => {
  const month = "January";
  const year = "2019";

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const snap = await db
        .collection(year)
        .doc(month)
        .collection("areaScores")
        .doc(`${i},${j}`)
        .get();

      const data = snap.data();

      if (!data) {
		  let count = 0;
		  let diff = 0;
        if (i > 0 && j > 0) {
		  count++;
		  const snap1 = await db
		  .collection(year)
		  .doc(month)
		  .collection("areaScores")
		  .doc(`${i-1},${j-1}`)
		  .get();	
          if (snap1.data()) {
            diff += (10-snap1.data().scoreData)
          }
        }

        if (i > 0) {
			count++
			const snap2 = await db
		  .collection(year)
		  .doc(month)
		  .collection("areaScores")
		  .doc(`${i-1},${j}`)
		  .get();
          if (snap2.data()) {
            diff += (10-snap2.data().scoreData)
          }
        }

        if (i > 0 && j < 9) {
			count++
			const snap3 = await db
		  .collection(year)
		  .doc(month)
		  .collection("areaScores")
		  .doc(`${i-1},${j+1}`)
		  .get();
          if (snap3.data()) {
            diff += (10-snap3.data().scoreData)
          }
        }

        if (j > 0) {
			count++
			const snap4 = await db
		  .collection(year)
		  .doc(month)
		  .collection("areaScores")
		  .doc(`${i},${j-1}`)
		  .get();
          if (snap4.data()) {
            diff += (10 - snap4.data().scoreData)
          }
        }

        if (j < 9) {
			count++
			const snap5 = await db
		  .collection(year)
		  .doc(month)
		  .collection("areaScores")
		  .doc(`${i},${j+1}`)
		  .get();
          if (snap5.data()) {
            diff += (10 - snap5.data().scoreData)
          }
        }

        if (i < 9 && j > 0) {
			count++
			const snap6 = await db
		  .collection(year)
		  .doc(month)
		  .collection("areaScores")
		  .doc(`${i+1},${j-1}`)
		  .get();
          if (snap6.data()) {
            diff += (10 - snap6.data().scoreData)
          }
        }

        if (i < 9) {
			count++
			const snap7 = await db
		  .collection(year)
		  .doc(month)
		  .collection("areaScores")
		  .doc(`${i+1},${j}`)
		  .get();
          if (snap7.data()) {
            diff += (10 - snap7.data().scoreData)
          }
        }

        if (i < 9 && j < 9) {
			count++
			const snap8 = await db
		  .collection(year)
		  .doc(month)
		  .collection("areaScores")
		  .doc(`${i+1},${j+1}`)
		  .get();
          if (snap8.data()) {
            diff += (10 - snap8.data().scoreData)
          }
		}
		
		const newData = {
			priority: diff/count
		}
		db.collection(year).doc(month).collection('Predictions').doc(`${i},${j}`).set(newData)
	  }
	  console.log(j)
	}
	console.log(i)
  }
  res.send('ok')
});
