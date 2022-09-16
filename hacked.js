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
//fetching the data

function loadJSON() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

//controller
//cleaning the data

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
    //find first initial
    student.initial = fullname.substring(0, 1).toLowerCase();
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

    allStudents.unshift(student);
  });

  populateStudentPop();
}

function capitalise(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
}

// view
//displaying the data

function populateStudentPop() {
  allStudents.forEach((student) => {
    console.log("displayStudent");
    const template = document.querySelector("#studentPop").content;
    const copy = template.cloneNode(true);
    const popUp = copy.querySelector(".student-pop");

    //the list of names
    copy.querySelector("[data-field = prefect]").input = student.prefect;
    copy.querySelector("[data-field = first-name]").textContent = student.firstName;
    copy.querySelector("[data-field = last-name]").textContent = student.lastName;
    copy.querySelector("[data-field = house]").textContent = student.house;
    copy.querySelector("[data-field = first-name]").addEventListener("click", clickShowPop);
    copy.querySelector("[data-field = last-name]").addEventListener("click", clickShowPop);
    //the pop up
    copy.querySelector(".first-name").textContent = student.firstName;
    copy.querySelector(".last-name").textContent = student.lastName;
    copy.querySelector(".middle-name").textContent = student.middleName;
    copy.querySelector(".nick-name").textContent = student.nickName;
    copy.querySelector(".house").textContent = student.house;
    copy.querySelector(".prefect").textContent = student.prefect;
    copy.querySelector(".expelled").textContent = student.expelled;
    copy.querySelector(".squad").textContent = student.inSquad;
    copy.querySelector(".portrait").src = `images/${student.lastName}_${student.initial}.png`;
    copy.querySelector(".close").addEventListener("click", clickShowPop);

    const parent = document.querySelector("#hogwartsData");
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
