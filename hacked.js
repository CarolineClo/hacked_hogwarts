"use strict";

//all consts
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

let allStudents = [];

const settings = {
  filter: "enrolled",
  sortBy: "firstName",
  sortDir: "asc",
};

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
  registerButtons();
  loadJSON();
}

//model
//adding event listeners

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

//fetching and preparing the data

function loadJSON() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareStudent);
  populateStudentPop(allStudents);
}

function prepareStudent(studentInfo) {
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
  return student;
}

function capitalise(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
}

//controler //creating filters

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  //filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  //let filteredList = allStudents;
  if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGriff);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlyth);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isHuff);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRave);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  }
  return filteredList;
}

function isGriff(student) {
  return student.house === "Gryffindor";
}

function isSlyth(student) {
  return student.house === "Slytherin";
}

function isHuff(student) {
  return student.house === "Hufflepuff";
}

function isRave(student) {
  return student.house === "Ravenclaw";
}

function isExpelled(student) {
  return student.expelled === true;
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  console.log(`user selected ${sortBy}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  //let sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByChoice);

  function sortByChoice(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

// view
//displaying the data

function populateStudentPop(allStudents) {
  document.querySelector("#hogwartsData").innerHTML = "";
  allStudents.forEach(displayAll);
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  populateStudentPop(sortedList);
  console.log(currentList);
}

function displayAll(student) {
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
}
