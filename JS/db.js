const processing = document.querySelector('.processing');
// const nav = document.querySelector('nav');
const confirmDetails = document.querySelector('.confirm-details');
const form = document.querySelector('.form');

const inputName = document.getElementById('name');
const inputNumber = document.getElementById('number');
const inputEmail = document.getElementById('email');
const inputDiners = document.getElementById('diners');
const inputTime = document.getElementById('time');
const inputDate = document.getElementById('date');
const inputRestriction = document.getElementById('restriction');

// Click 'Save', show form with form info and submit button

saveButton = document.querySelector('.btn-primary');
saveButton.addEventListener('click', e => {
  e.preventDefault();
  console.log('1) clicked save');
  openForm();
  showNewReservation();
});

const showNewReservation = function () {
  console.log('2) Show new reservation');

  const dataObject = {
    name: form.name.value,
    diners: form.diners.value,
    time: form.time.value,
    date: form.date.value,
    email: form.email.value,
    number: form.number.value,
    restriction: form.restriction.value,
    booked: 0,
  };

  console.log('dataObject', dataObject);

  const { name, number, email, diners, time, date, restriction, booked } =
    dataObject;

  // if (
  //   dataObject.name == '' ||
  //   dataObject.diners == '' ||
  //   dataObject.time == '' ||
  //   dataObject.date == '' ||
  //   dataObject.number == ''
  // ) {
  //   alert('Please fill out all fields before proceeding');
  // }
  // if (form.diners.value >= 9) {
  //   clearDiners();
  // }
  // if (timeRange() < 1600 || timeRange() > 2130) {
  //   clearTime();
  // }
  // if (form.date.value < todayDate()) {
  //   clearDate();
  // }
  // if (currentTime() < 1500 && todayDate() === date) {
  //   beforeThree();
  // } else {
  confirmDetails.innerHTML = `
            <div class="form__Container" >
                <h3>Please Confim Your Reservation Details</h3>
                <span>Name: ${name}</span>
                <span>Party of ${diners}</span>
                <span>Time: ${milToStandard(time)}</span>
                <span>Date: ${date}</span>
                <span>Email: ${email}</span>
                <span>Cell Number: ${number}</span>
                <span>Dietary Restrictions: ${
                  restriction.length >= 100
                    ? `${restriction.substring(0, 100)}...`
                    : restriction
                }</span> 
            </div>
            `;

  //}
};

// Click 'Submit' and send formData to Firebase

submitButton = document.querySelector('.submit');
submitButton.addEventListener('click', e => {
  e.preventDefault();
  console.log('3) Clicked Submit');
  addNewReservation();
  closeForm();
});

const addNewReservation = function () {
  console.log('4) addNewReservation');

  const dataObject = {
    name: form.name.value,
    diners: form.diners.value,
    time: form.time.value,
    date: form.date.value,
    email: form.email.value,
    number: form.number.value,
    restriction: form.restriction.value,
    booked: 0,
  };

  db.collection('kodama')
    .add(dataObject)
    .then(value => {
      const id = value.id;
      console.log('5) new id', id);
      getDoc(id);
    });
};

async function getDoc(id) {
  const snapshot = await db.collection('kodama').doc(id).get();
  const data = snapshot.data();
  console.log('6) Data', data);
  openFormP(data, id);
}

function openFormP(data, id) {
  document.getElementById('popupProcessing').style.display = 'block';
  console.log('7) openFormP');

  const showResDetails = function (data, id) {
    console.log('9) showResDetails');
    const { name, diners, time, date, number, email, restriction } = data;
    const output = `
              <div class="form__Container">
                    <h3>We Are Processing Your Request. Please Check Your email For Confirmation</h3>
                    <span>${name}</span>
                    <span>Party of ${diners}</span>
                    <span>${milToStandard(time)}</span>
                    <span>${date}</span>
                    <span>${email}</span>
                    <span>${number}</span>
                    <span>Dietary Restrictions: ${restriction}</span>
                    <span>Reservation ID: ${id}</span>
              </div>
              `;
    processing.innerHTML += output;
  };
  showResDetails(data, id);
}

const clearAllInput = function () {
  // Reset the form values
  (form.name.value = ''),
    (form.number.value = ''),
    (form.diners.value = ''),
    (form.email.value = ''),
    (form.time.value = ''),
    (form.date.value = ''),
    (form.restriction.value = '');
  window.location.reload();
};

// clearAllInput();

// const MilTime = formData().time;
// console.log(MilTime);

const milToStandard = function (value) {
  if (value !== null && value !== undefined) {
    //If value is passed in
    if (value.indexOf('AM') > -1 || value.indexOf('PM') > -1) {
      //If time is already in standard time then don't format.
      return value;
    } else {
      if (value.length == 5) {
        //If value is the expected length for military time then process to standard time.
        var hour = value.substring(0, 2); //Extract hour
        var minutes = value.substring(3, 5); //Extract minutes
        var identifier = 'AM'; //Initialize AM PM identifier

        if (hour == 12) {
          //If hour is 12 then should set AM PM identifier to PM
          identifier = 'PM';
        }
        if (hour == 0) {
          //If hour is 0 then set to 12 for standard time 12 AM
          hour = 12;
        }
        if (hour > 12) {
          //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
          hour = hour - 12;
          identifier = 'PM';
        }
        return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
      } else {
        //If value is not the expected length than just return the value as is
        return value;
      }
    }
  }
};
// // const StandardTime = milToStandard(MilTime);
// console.log(milToStandard(formData.time));

// Get Values entered by user

// Book an event

// let bookedEvents = [];

// const bookEvent = (booked, id) => {
//   console.log('4) bookevent', booked, id);
//   const getBookedEvents = localStorage.getItem('booked-events');
//   console.log('4.25)', getBookedEvents);

//   if (getBookedEvents) {
//     bookedEvents = JSON.parse(localStorage.getItem('booked-events'));
//     if (bookedEvents.includes(id)) {
//       //alert('Seems like you have already booked this reservation')
//       console.log('4.5) you already booked');
//     } else {
//       saveBooking(booked, id);
//     }
//   } else {
//     saveBooking(booked, id);
//   }
// };

// const saveBooking = (booked, id) => {
//   console.log('5) saveBooking');
//   // bookedEvents.push(id);
//   // localStorage.setItem('booked-events', JSON.stringify(bookedEvents));

//   const data = { booked: booked + 1 };
//   db.collection('events')
//     .doc(id)
//     .update(data)
//     .then(() => alert('We will text your reservation confirmation shortly'))
//     .catch(err => console.log(err));
// };
// Show and update

// Helpers
const clearDiners = function () {
  form.diners.value = '';
  alert('For parties larger than 8 please call us at 503-555-1581');
};

const clearTime = function () {
  form.time.value = '';
  alert('Reservations may only be made for times between 4 pm and 9:30 pm');
};

const clearDate = function () {
  alert('Reservations may not be made on any date prior to today');
  form.date.value = '';
};

const beforeThree = function () {
  alert(
    'Reservations must be made prior to 3:00 pm on the day of the reservation.'
  );
  form.date.value = '';
};

const timeRange = function () {
  return form.time.value.split(':').join().replace(',', '');
};

const currentTime = function () {
  let currentDate = new Date();
  let time =
    currentDate.getHours() +
    ':' +
    currentDate.getMinutes() +
    ':' +
    currentDate.getSeconds();
  return time
    .split(':')
    .map(x => (x.length < 2 ? '0' + x : x))
    .join()
    .replace(/,/g, '')
    .substring(0, 4);
};

const todayDate = function () {
  const nd = new Date();
  const m = nd.getMonth() + 1;
  const d = nd.getDay() + 1;
  const y = nd.getFullYear();
  const date = [y, m, d];
  return date
    .map(String)
    .map(x => (x.length < 2 ? '0' + x : x))
    .join('-');
};

clearButton = document.querySelector('.reset');
clearButton.addEventListener('click', e => {
  e.preventDefault();
  clearAllInput();
});

function openForm() {
  document.getElementById('popupForm').style.display = 'block';
}
function closeForm() {
  document.getElementById('popupForm').style.display = 'none';
}
function closeFormP() {
  document.getElementById('popupProcessing').style.display = 'none';
  clearAllInput();
}

if (module.hot) {
  module.hot.accept();
}
// import 'core-js/stable';
