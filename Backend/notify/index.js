const getDoctorsListFromDB = require('./getDoctorsListFromDB');
const visitDoctorPage = require('./visitDoctor').visitDoctor;
const checkAvailability = require('./visitDoctor').checkAvailability;
const deleteUnvalidLink = require('./deleteUnvalidLink');
const notifyUsersAndGetMoney = require('./notifyUsersAndGetMoney');
const phantom = require('phantom');

async function WorkWithSeparateDoctor(doc, theArray) {
    for (const entry of theArray) {
        let schedule;
        try {
            schedule = await visitDoctorPage(doc, entry);
        } catch (e) {
            if (e.message === 'Invalid doctor link') {
                deleteUnvalidLink(entry);
            } else {
                console.error(e.message);
                throw e;
            }
        }
        const arrayOfDates = await checkAvailability(schedule);
        if (arrayOfDates) {
            await notifyUsersAndGetMoney(entry, arrayOfDates);
        }
    }
}

async function main() {
    const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
    const doc = await instance.createPage();
    let docList = await getDoctorsListFromDB();
    Promise.resolve()
        .then(function resolver() {
            return WorkWithSeparateDoctor(doc, Object.keys(docList))
                .then(async () => {
                    docList = await getDoctorsListFromDB();
                    if (!docList) {
                        setTimeout(() => {}, 600000);
                    }
                })
                .then(resolver);
        })
        .catch(async e => {
            console.error(e);
            await instance.exit();
        });
}

module.exports = main;
