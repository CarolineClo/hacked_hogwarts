////MODEL////

"use strict";

window.addEventListener("DOMContentLoaded", start);

//all consts
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodURL = "https://petlatkea.dk/2021/hogwarts/families.json";

let halfArr = [];
let pureArr = [];
let hacked = false;
let allStudents = [];
let lastNamearr = [];
let expelledArr = [];
let duplicateLastNames;
let isHPressed = false;
let isAPressed = false;
let isCPressed = false;
let isKPressed = false;
let jsonData;
let bloodJSON;

const settings = {
  filter: "enrolled",
  sortBy: "firstName",
  sortDir: "asc",
  search: "",
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
  hacker: false,
};

const hacker = {
  firstName: "Caroline",
  middleName: "",
  nickName: "",
  lastName: "Cloughley",
  Photo: "",
  house: "Ravenclaw",
  bloodStatus: "pure-blood",
  prefect: false,
  expelled: false,
  inSquad: false,
  hacker: true,
};

async function start() {
  addListeners();
  await loadJSON();
  await loadBloodJSON();
  prepareObjects();
}

//add event listeners//

function addListeners() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
  document.querySelector("[data-search ]").addEventListener("input", selectSearch);
  document.addEventListener("keyup", inputHack);
}

//fetching and preparing the data

async function loadJSON() {
  const resp = await fetch(url);
  const data = await resp.json();
  jsonData = data;
}

async function loadBloodJSON() {
  const resp = await fetch(bloodURL);
  const data = await resp.json();
  bloodJSON = data;
}

////CONTROLLER///

async function prepareObjects() {
  allStudents = jsonData.map(prepareStudent);
  allStudents.forEach(populateImg);
  allStudents.forEach(findBlood);

  halfArr = bloodJSON.half;
  pureArr = bloodJSON.pure;

  buildList();
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  const searchedList = searchList(sortedList);
  populateStudentPop(searchedList);
  allStudents.forEach(findArrays);
}

function findBlood(student) {
  halfArr = bloodJSON.half;
  pureArr = bloodJSON.pure;

  if (pureArr.includes(student.lastName) && halfArr.includes(student.lastName)) {
    student.bloodStatus = "Half Blood";
  } else if (pureArr.includes(student.lastName)) {
    student.bloodStatus = "Pure Blood";
  } else {
    student.bloodStatus = "Muggle born";
  }
}

function populateStudentPop(allStudents) {
  document.querySelector("#hogwartsData").innerHTML = "";
  allStudents.forEach(displayAll);
}

function findDuplicates() {
  lastNamearr = allStudents.map((a) => a.lastName);
  duplicateLastNames = lastNamearr.filter((lastName, i, aar) => aar.indexOf(lastName) === i && aar.lastIndexOf(lastName) !== i);
  return duplicateLastNames;
}

function populateImg(student) {
  if (student.lastName === findDuplicates()[0]) {
    // console.log(findDuplicates()[0] === student.lastName);
    student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
  } else if (student.firstName === student.lastName) {
    student.imageName = "";
  } else if (student.lastName.includes("-")) {
    student.imageName = `${student.lastName.substring(student.lastName.indexOf("-") + 1).toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
  } else {
    student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
  }
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
  //find nickName and capatalise
  if (fullname.includes(`"`)) {
    student.nickName = fullname.split(`"`)[1];
    student.nickName = capitalise(student.nickName);
  } else {
    student.nickName = "none";
  }
  //get middlename and capatalise
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

//searchbar
//find search term
function selectSearch(event) {
  // allStudents.forEach(setSearch);
  const value = event.target.value.toLowerCase();
  setSearch(value);
}
//add the seacrhed filter
function setSearch(search) {
  settings.search = search;
  buildList();
}

//create searchedList from search value
function searchList(searchedList) {
  searchedList = searchedList.filter(isSearched);
  return searchedList;
}

//creating filters
//find the selected filter
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  setFilter(filter);
}

//add the filter
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

//create the filtered list from selected filter
function filterList(filteredList) {
  if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGriff);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlyth);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isHuff);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRave);
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledArr;
    //filteredList = allStudents.filter(isExpelled);
  } else if (settings.filterBy === "enrolled") {
    filteredList = allStudents.filter(isEnrolled);
  } else if (settings.filterBy === "all") {
    filteredList = allStudents;
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

function isEnrolled(student) {
  return student.expelled === false;
}

function isSearched(student) {
  return student.firstName.toLowerCase().includes(settings.search) || student.lastName.toLowerCase().includes(settings.search);
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  //find old sortBy element and remove sortby
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");
  //indicate active sort
  event.target.classList.add("sortby");

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

function attemptPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const othersInHouse = prefects.filter((student) => student.house === selectedStudent.house);
  console.log(othersInHouse);
  const numberOfothers = othersInHouse.length;

  if (numberOfothers >= 2) {
    console.log(`there can only be two prefects in each house ${othersInHouse[0].firstName}`);
    removeAorB(othersInHouse[0], othersInHouse[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    //warning box asks to remove A or B
    console.log(prefectA.firstName);
    document.querySelector("#onlyTwoPrefects").classList.add("show");
    document.querySelector("#onlyTwoPrefects button.close-button").addEventListener("click", closeWarning);
    document.querySelector("#onlyTwoPrefects [data-action=remove1]").addEventListener("click", clickRemoveA);
    document.querySelector("#onlyTwoPrefects [data-action=remove2]").addEventListener("click", clickRemoveB);
    document.querySelector("#onlyTwoPrefects span.student1").innerHTML = `${prefectA.firstName} ${prefectA.lastName} as a ${prefectA.house} prefect`;
    document.querySelector("#onlyTwoPrefects span.student2").innerHTML = `${prefectB.firstName} ${prefectB.lastName} as a ${prefectB.house} prefect`;

    //ignore do nothing
    function closeWarning() {
      document.querySelector("#onlyTwoPrefects").classList.remove("show");
      document.querySelector("#onlyTwoPrefects button.close-button").removeEventListener("click", closeWarning);
      document.querySelector("#onlyTwoPrefects [data-action=remove1]").removeEventListener("click", clickRemoveA);
      document.querySelector("#onlyTwoPrefects [data-action=remove2]").removeEventListener("click", clickRemoveB);
    }

    //if remove prefectA is clicked
    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeWarning();
    }

    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeWarning();
    }
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}

function findArrays() {
  let gryffinArr = allStudents.filter(isGriff);
  let slytherinArr = allStudents.filter(isSlyth);
  let ravenArr = allStudents.filter(isRave);
  let huffArr = allStudents.filter(isHuff);
  let expellArr = expelledArr;
  let enrolArr = allStudents.filter(isEnrolled);
  document.querySelector(".enroll-students").innerHTML = `Enrolled Students: ${enrolArr.length}`;
  document.querySelector(".expell-students").innerHTML = `Expelled Students: ${expellArr.length}`;
  document.querySelector(".huff-students").innerHTML = `Hufflepuff Students: ${huffArr.length}`;
  document.querySelector(".rave-students").innerHTML = `Ravenclaw Students: ${ravenArr.length}`;
  document.querySelector(".gryff-students").innerHTML = `Gryffindor Students: ${gryffinArr.length}`;
  document.querySelector(".slyth-students").innerHTML = `Slytherin Students: ${slytherinArr.length}`;
  document.querySelector(".all-students").innerHTML = `Total Students: ${allStudents.length}`;
}

////HACKING////

function inputHack(event) {
  let x = event.key;

  if (x === "H") {
    isHPressed = true;
    console.log(`is H  pressed ?`, isHPressed);
  }
  if (x === "a") {
    isAPressed = true;
    console.log(`is a  pressed ?`, isAPressed);
  }

  if (x === "c") {
    isCPressed = true;
    console.log(`is c  pressed ?`, isCPressed);
  }

  if (x === "k") {
    isKPressed = true;
    console.log(`is k  pressed ?`, isKPressed);
  }
  hack();
}

function hack() {
  if (isHPressed === true && isAPressed === true && isCPressed === true && isKPressed === true) {
    document.removeEventListener("keyup", inputHack);
    console.log("system is hacked");
    allStudents.forEach(hackedBlood);
    allStudents.push(hacker);
    //allStudents.forEach(test);
    document.querySelector("#hackedWarning").classList.add("show");
    buildList();
  } else {
    console.log("not hacked");
  }
}

function hackedBlood(student) {
  hacked = true;
  if (student.bloodStatus === "Muggle born" || student.bloodStatus === "Half Blood") {
    student.bloodStatus = "Pure Blood";
  }
  if (student.bloodStatus === "Pure Blood") {
    function getRandomBlood(max) {
      return Math.floor(Math.random() * max);
    }
    let x = getRandomBlood(3);

    if (x === 1) {
      student.bloodStatus = "Pure Blood";
    }
    if (x === 2) {
      student.bloodStatus = "Half Blood";
    }

    if (x === 3) {
      student.bloodStatus = "Muggle Born";
    }
  }
}

// VIEW//

//displaying the data

function displayAll(student) {
  const template = document.querySelector("#studentPop").content;
  const copy = template.cloneNode(true);
  const popUp = copy.querySelector(".student-pop");
  const expelledWarning = copy.querySelector(".expelled-warning");
  const expellbutton = copy.querySelector(".expell-button");
  const inquisitorButton = copy.querySelector(".inquisitor-button");
  const popMessage = copy.querySelector(".student-pop .message ");
  const crest = copy.querySelector(".student-pop .house-heading img");

  //the list of names

  copy.querySelector("[data-field = first-name]").textContent = student.firstName;
  copy.querySelector("[data-field = last-name]").textContent = student.lastName;
  copy.querySelector("[data-field = house]").textContent = student.house;
  copy.querySelector("[data-field = first-name]").addEventListener("click", clickShowPop);
  copy.querySelector("[data-field = last-name]").addEventListener("click", clickShowPop);
  copy.querySelector("[data-field = house]").addEventListener("click", clickShowPop);

  //the pop up
  copy.querySelector(".first-name").textContent = student.firstName;
  copy.querySelector(".last-name").textContent = student.lastName;
  copy.querySelector(".middle-name").textContent = student.middleName;
  copy.querySelector(".nick-name").textContent = student.nickName;
  copy.querySelector(".house").textContent = student.house;
  copy.querySelector(".prefect").textContent = student.prefect;
  copy.querySelector(".blood-status").textContent = student.bloodStatus;

  copy.querySelector(".squad").textContent = student.inSquad;
  copy.querySelector(".portrait").src = `images/${student.imageName}`;
  copy.querySelector(".close").addEventListener("click", clickShowPop);
  if (student.expelled === true) {
    expelledWarning.classList.add("show");
    expellbutton.classList.add("hide");
    copy.querySelector("tr.student-list").classList.add("expelled-student");
  }

  if (student.house === "Ravenclaw") {
    popMessage.classList.add("ravenclaw");
    crest.src = "images/rave_1@.png";
  }

  if (student.house === "Gryffindor") {
    popMessage.classList.add("gryffindor");
    crest.src = "images/gryf@.png";
  }

  if (student.house === "Slytherin") {
    popMessage.classList.add("slytherin");
    crest.src = "images/slyth_2@.png";
  }

  if (student.house === "Hufflepuff") {
    popMessage.classList.add("hufflepuff");
    crest.src = "images/huff_1@.png";
  }

  function clickShowPop() {
    if (popUp.classList.contains("show")) {
      popUp.classList.remove("show");
    } else {
      expellbutton.addEventListener("click", expellStudent);
      inquisitorButton.addEventListener("click", selectInquisitor);
      popUp.classList.add("show");
    }
  }

  function expellStudent() {
    if (student.hacker === false) {
      student.expelled = true;
      expelledArr.push(student);

      const index = allStudents.findIndex((element) => {
        if (element.firstName === student.firstName) {
          return true;
        }
        return false;
      });

      const splicedArray = allStudents.splice(index, 1);
      const expelledStudent = splicedArray[0];
      popUp.classList.remove("show");
      buildList();
    } else {
      document.querySelector("#cannotExpell").classList.add("show");
      document.querySelector("#cannotExpell button.close-button").addEventListener("click", closeWarning);
    }

    function closeWarning() {
      document.querySelector("#cannotExpell").classList.remove("show");
      document.querySelector("#cannotExpell button.close-button").removeEventListener("click", closeWarning);
      // document.querySelector("#cannotExpell [data-action=remove1]").removeEventListener("click", clickRemoveA);
      // document.querySelector("#cannotExpell [data-action=remove2]").removeEventListener("click", clickRemoveB);
    }
  }

  //appoint inquisitors//

  function selectInquisitor() {
    if (student.inSquad === true) {
      student.inSquad = false;
    } else {
      attemptInquisitor(student);
    }
  }

  function attemptInquisitor() {
    if (student.bloodStatus === "Pure Blood") {
      student.inSquad = true;
      document.querySelector("#added").classList.add("show");
      document.querySelector("#added button.close-button").addEventListener("click", closeWarning);
      buildList();
      if (hacked === true) {
        setTimeout(() => {
          student.inSquad = false;
          document.querySelector("#squadHacked").classList.add("show");
          document.querySelector("#squadHacked span.squad-member").innerHTML = `${student.firstName} ${student.lastName}`;
          document.querySelector("#squadHacked button.close-button").addEventListener("click", closeWarning);
          buildList();
        }, 3000);
      }
    }

    if (student.house === "Slytherin") {
      student.inSquad = true;
      document.querySelector("#added").classList.add("show");
      document.querySelector("#added button.close-button").addEventListener("click", closeWarning);
      buildList();
      if (hacked === true) {
        setTimeout(() => {
          student.inSquad = false;
          document.querySelector("#squadHacked").classList.add("show");
          document.querySelector("#squadHacked span.squad-member").innerHTML = `${student.firstName} ${student.lastName}`;
          document.querySelector("#squadHacked button.close-button").addEventListener("click", closeWarning);
          buildList();
        }, 3000);
      }
    } else {
      document.querySelector("#notPure").classList.add("show");
      document.querySelector("#notPure button.close-button").addEventListener("click", closeWarning);
    }

    function closeWarning() {
      document.querySelector("#squadHacked").classList.remove("show");
      document.querySelector("#squadHacked button.close-button").removeEventListener("click", closeWarning);
      document.querySelector("#notPure").classList.remove("show");
      document.querySelector("#notPure button.close-button").removeEventListener("click", closeWarning);
      document.querySelector("#added").classList.remove("show");
      document.querySelector("#added button.close-button").removeEventListener("click", closeWarning);
    }
  }

  //appoint prefect

  if (student.prefect === true) {
    copy.querySelector("[data-field = prefect]").textContent = "????";
  } else {
    copy.querySelector("[data-field = prefect]").textContent = "???";
  }

  copy.querySelector("[data-field = prefect]").dataset.prefect = student.prefect;
  copy.querySelector("[data-field = prefect]").addEventListener("click", selectPrefect);

  function selectPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      attemptPrefect(student);
    }
    buildList();
  }

  const parent = document.querySelector("#hogwartsData");
  parent.appendChild(copy);
}
