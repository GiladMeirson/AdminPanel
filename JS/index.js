allDB = {};
Users = [];
LocalQuestions = [];

function init() {
  StartingValid();
  ref = firebase.database().ref("DBB");
  listenToNewMessages();


  //--Important not remove this comment until publish project scripted...--//
  // const obj = {
  //   Type:'Master',
  //   Id:*****,
  //   Pass:'*******'
  // }
  // InsertObjToDB(obj);


  //Adding Events
  document.getElementById('AdminPassIn').addEventListener('keypress',(e)=>{

    if (e.key=='Enter') {
      console.log(e.srcElement.value,'his password dont worry');
      let his = e.srcElement.value;
      ref.once("value", (snapshot) => {
        snapshot.forEach((element) => {
          const Piecse = element.val();
          if (Piecse.Type=='Master') {
            if (Piecse.Id == -1994) {
              if (Piecse.Pass==his) {
                //success
                swal('Success!','Welcome Admin','success');
                ShowInsertContainer();

              } else {
                //password wrong
                swal('Wrong Password','Try again and get the right password','error');
              }
            }
          }
        });
      });

    }
  })

  // ref.push().set(DB);

  //  ChangeUpdateDB(DB);
}

//-----------------------------------------Manage-----------------------------------------//

function InsertQuestion() {
  const QuestBody = document.getElementById("questIN").value;
  const CorrectAnswer = document.getElementById("answerIN").value;
  const DisA = document.getElementById("ansAIN").value;
  const DisB = document.getElementById("ansBIN").value;
  const DisC = document.getElementById("ansCIN").value;
  const Season = document.getElementById("SeasonIN").value;
  const Episode = document.getElementById("EpisodeIN").value;
  const Level = document.getElementById("levelIN").value;
  const id = GenerateId();

  if (
    QuestBody == "" ||
    CorrectAnswer == "" ||
    DisA == "" ||
    DisB == "" ||
    DisC == ""
  ) {
    swal("Empty Values", `Empty Values \n please fill all the fields`, "error");
    return;
  } else {
    const Question = {
      Id: id,
      Type: "Q",
      QuestId: "Q" + id,
      QuestBody: QuestBody,
      CorrectAnswer: CorrectAnswer,
      DisA: DisA,
      DisB: DisB,
      DisC: DisC,
      Season: Season,
      Episode: Episode,
      Level: Level,
    };
    InsertObjToDB(Question);
    document.getElementById("questIN").value = "";
    document.getElementById("answerIN").value = "";
    document.getElementById("ansAIN").value = "";
    document.getElementById("ansBIN").value = "";
    document.getElementById("ansCIN").value = "";
    swal("Success", "your upload is saved.", "success");
  }
}

function DeleteQuest() {
  const id = document.getElementById("IdQuestIN").value;
  let newArray = [];
  let flag = false;
  // swal("Deleted", `Question number ${id} deleted`, "success");
  // swal(
  //   "Not Exist",
  //   `Question number ${id}\nis not exist in the data base`,
  //   "error"
  // );

  ref.once("value", (snapshot) => {
    LocalQuestions = [];
    snapshot.forEach((element) => {
      const Piecse = element.val();
      if (Piecse.Id == id) {
        ref.child(element.key).remove();
        console.log("remove success !!");
        flag = true;
      } else {
        LocalQuestions.push(Piecse);
      }
    });
    RenderQuestion(LocalQuestions);
    if (flag) {
      swal("Deleted", `Question number ${id} deleted`, "success");
    } else {
      swal(
        "Not Exist",
        `Question number ${id}\nis not exist in the data base`,
        "error"
      );
    }
  });
}

function RenderOneQuest() {
  const id = document.getElementById("idQuestAIN").value;
  let flag = false;
  LocalQuestions.forEach((q) => {
    if (q.Id == id) {
      let arr = [];
      arr.push(q);
      RenderQuestion(arr);
      flag = true;
    }
  });
  if (flag == false) {
    swal(
      "Not Exist",
      `Question number ${id}\nis not exist in the data base`,
      "error"
    );
  }
}

function CallToRenderAll() {
  RenderQuestion(LocalQuestions);
}

//-----------------------------------------Manage-----------------------------------------//

//-----------------------------------------DB-----------------------------------------//

function ChangeUpdateDB(obj) {
  //firebaseDB=Local DB
  ref.once("value", (snapshot) => {
    snapshot.forEach((element) => {
      const Piecse = element.val();
      if (Piecse.title == "Freinds-Game") {
        ref.child(element.key).set(obj);
        console.log("update success !!");
        return true;
      }
    });
  });
}

function GetDB() {
  //local DB= firebaseDB
  ref.once("value", (snapshot) => {
    snapshot.forEach((element) => {
      const Piecse = element.val();
      if (Piecse.title == "Freinds-Game") {
        console.log(Piecse);
        DB = Piecse;
      }
    });
  });
}
function InsertObjToDB(obj) {
  ref.push().set(obj);
}

function BringAllData() {
  let arrReturn = [];
  ref.once("value", (snapshot) => {
    snapshot.forEach((element) => {
      const Piecse = element.val();
      arrReturn.push(Piecse);
    });
  });
  return arrReturn;
}

function GenerateId() {
  let arr = BringAllData();
  let ids = [];
  arr.forEach((element) => {
    ids.push(element);
  });
  var luckynum = Math.round(Math.random() * 99999);
  while (ids.includes(luckynum)) {
    luckynum = Math.round(Math.random() * 99999);
  }
  return luckynum;
}

//-----------------------------------------DB-----------------------------------------//

//-----------------------------------------Renders-----------------------------------------//

function RenderQuestion(array) {
  let str = ``;
  const ph = document.getElementById("QuestPH");

  array.forEach((element) => {
    str += `<div id="${element.Id}" class="QuestCard">`;
    str += `<p>Body: ${element.QuestBody}</p>`;
    str += `<p>Correct Answer: ${element.CorrectAnswer}</p>`;
    str += `<p>Answer B: ${element.DisA}</p>`;
    str += `<p>Answer C: ${element.DisB}</p>`;
    str += `<p>Answer D: ${element.DisC}</p>`;
    str += `<p>Id: ${element.QuestId} ||| Level: ${element.Level} ||| Refrence: S${element.Season} E${element.Episode}</p>`;
    str += "</div>";
  });
  ph.innerHTML = str;

  //   <div id="" class="QuestCard">
  //   <p>Body:XXXXXXXXXXXXXXXX</p>
  //   <p>Correct Answer:XXXXXXXXXXXXXXXX</p>
  //   <p>Answer B:XXXXXXXXXXXXXXXX</p>
  //   <p>Answer C:XXXXXXXXXXXXXXXX</p>
  //   <p>Answer D:XXXXXXXXXXXXXXXX</p>
  //   <p>Id: XXXX ||| Level: XXX ||| Refrence: Sx Ey</p>

  // </div>
}

//-----------------------------------------Renders-----------------------------------------//

//-----------------------------------------MODAL-----------------------------------------//

function ShowInsertContainer() {
  $("#deleteContainer").fadeOut(200);
  $("#DisplayContainer").fadeOut(200);
  $("#insertContainer").fadeIn(750);
  $("#Validation").fadeOut(200);

}

function ShowDeleteContainer() {
  $("#DisplayContainer").fadeOut(200);
  $("#insertContainer").fadeOut(750);
  $("#deleteContainer").fadeIn(200);
  $("#Validation").fadeOut(200);

}

function ShowDisplayContainer() {
  $("#insertContainer").fadeOut(200);
  $("#deleteContainer").fadeOut(200);
  $("#Validation").fadeOut(200);

  $("#DisplayContainer").fadeIn(750);
}

function StartingValid() {
  $("#insertContainer").fadeOut(200);
  $("#deleteContainer").fadeOut(200);
  $("#DisplayContainer").fadeOut(200);
  $('#Validation').fadeIn(500);
}

//-----------------------------------------MODAL-----------------------------------------//

function listenToNewMessages() {
  // child_added will be evoked for every child that was added
  // on the first entry, it will bring all the childs

  ref.on("child_added", (snapshot) => {
    const Piecse = snapshot.val();
    if (Piecse.Type == "Q") {
      LocalQuestions.push(Piecse);
      RenderQuestion(LocalQuestions);
    }
  });
}
