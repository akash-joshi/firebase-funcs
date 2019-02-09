exports.createAreas = functions.https.onRequest((req, res) => {
  const initLat = 18.5579361;
  const initLong = 73.81456925;
  const latChange = 0.0075198;
  const longChange = 0.0092065;
  const areaScore = 10;
  let i;
  let j;

  let latitude = initLat;
  let longitude = initLong;

  for (i = 0; i < 10; i++) {
    latitude = initLat;

    for (j = 0; j < 10; j++) {
      const location = {
        latitude,
        longitude,
        areaScore
      };
      db.collection("areaData")
        .doc(`${i},${j}`)
        .set(location);
      latitude -= latChange;
      console.log(i);
    }
    longitude += longChange;
    console.log(j);
  }
  res.send("yeet");
});

exports.createUser = functions.firestore
  .document("2019/January/Reports/{reportId}")
  .onCreate(async (snap1, context) => {
    const snap = await db
      .collection("2019")
      .doc("January")
      .get();
    let report_count = parseInt(snap.data().report_count);
    report_count += 1;

    let prediction_count = parseInt(snap.data().prediction_count);
    /*while (prediction_count <= report_count / 4) {
      let longitude = (Math.random() * 0.0002).toFixed(5);
      longitude *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
      let latitude = (Math.random() * 0.0002).toFixed(5);
      latitude *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
      const locdata = {
        location: {
          latitude,
          longitude
        }
      };
      db.collection("2019")
        .doc("January")
        .collection("Predictions")
        .add(locdata);
      prediction_count++;
    }*/
    db.collection("2019")
      .doc("January")
      .set({ report_count, prediction_count });
  });

exports.createUser = functions.firestore
  .document("2019/January/Reports/{reportId}")
  .onCreate(async (snap1, context) => {
    const snap = await db
      .collection("2019")
      .doc("January")
      .get();
    let report_count = parseInt(snap.data().report_count);
    report_count += 1;

    db.collection("2019")
      .doc("January")
      .set({ report_count });
  });

exports.createData = functions.https.onRequest(async (req, res) => {
  let i = 0;

  for (i = 0; i < 10; i++) {
    const areaX = Math.floor(Math.random() * 10);
    const areaY = Math.floor(Math.random() * 10);
    const data = {
      areaX,
      areaY
    };
    conf = await db
      .collection("2018")
      .doc("June")
      .collection("Reports")
      .add(data);
    console.log(i);
  }

  res.send("may");
});

exports.getScore = functions.https.onRequest(async (req, res) => {
	const month = 'January'
	const snap = await  db.collection('2018').doc(month).collection('Reports').get()
	snap.forEach(async doc=>{
		const data = doc.data()
		const { areaX, areaY } = data;
		const score = await db.collection('2018').doc(month).collection('areaScores').doc(`${areaX},${areaY}`).get()
		let scoreDat = score.data()
		let scoreData
		if(!scoreDat)
			scoreData = 10
		else scoreData = scoreDat.scoreData	
		scoreData--;
		db.collection('2018').doc(month).collection('areaScores').doc(`${areaX},${areaY}`).set({scoreData})
	})
	res.send('ok')
});