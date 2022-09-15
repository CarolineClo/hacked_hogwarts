"use strict";

//all consts
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

const allStudents = [];

const studentObj = {
  firstName: "",
  middleName: "null",
  nickName: "null",
  lastName: "",
  Photo: "",
  house: "",
  bloodStatus: "",
  prefect: false,
  expelled: false,
  inSquad: false,
};

window.addEventListener("DOMContentLoaded", start);

function start() {
  loadJSON();
}

//model
function loadJSON() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

//controller
function prepareObjects(jsonData) {
  jsonData.forEach((studentInfo) => {
    const student = Object.create(studentObj);

    student.house = studentInfo.house.trim();
    student.house = capitalise(student.house);

    let fullname;
    //takeaway the random spaces
    fullname = studentInfo.fullname.trim();
    //get first name and capitalise it
    student.firstName = fullname.split(` `)[0];
    student.firstName = capitalise(student.firstName);
    //find lastName and capitalise it
    student.lastName = fullname.substring(fullname.lastIndexOf(" ") + 1);
    student.lastName = capitalise(student.lastName);
    //find nickName and capatalise
    if (fullname.includes(`"`)) {
      student.nickName = fullname.split(`"`)[1];
      student.nickName = capitalise(student.nickName);
    } else {
      student.nickName = "none";
    }

    if (fullname.split(" ").length > 2 && fullname.includes(`"`) === false) {
      student.middleName = fullname.split(` `)[1];
      student.middleName = capitalise(student.middleName);
    } else {
      student.middleName = "none";
    }
    console.log(student);
    allStudents.unshift(student);
    console.log(allStudents);
  });

  populateStudentPop();
}

function capitalise(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
}

// view
function populateStudentPop() {
  allStudents.forEach((student) => {
    console.log("displayStudent");
    const template = document.querySelector("#studentPop").content;
    const copy = template.cloneNode(true);
    const popUp = copy.querySelector(".student-pop");
    copy.querySelector(".full-name").textContent = `${student.firstName} ${student.lastName}`;
    copy.querySelector(".first-name").textContent = `First Name: ${student.firstName}`;
    copy.querySelector(".last-name").textContent = `Last Name: ${student.lastName}`;
    copy.querySelector(".middle-name").textContent = `Middle Name: ${student.middleName}`;
    copy.querySelector(".nick-name").textContent = `Nickname: ${student.nickName}`;
    copy.querySelector(".house").textContent = `House: ${student.house}`;
    copy.querySelector(".prefect").textContent = `Prefect Status: ${student.prefect}`;
    copy.querySelector(".expelled").textContent = `Student Expelled: ${student.expelled}`;
    copy.querySelector(".squad").textContent = `Student in Squad: ${student.inSquad}`;
    copy.querySelector(".student-list").addEventListener("click", clickShowPop);

    const parent = document.querySelector("main");
    parent.appendChild(copy);

    function clickShowPop() {
      if (popUp.classList.contains("show")) {
        popUp.classList.remove("show");
      } else {
        popUp.classList.add("show");
      }
    }
  });
}
