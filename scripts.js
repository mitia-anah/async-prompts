function wait(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function destroyPopup(popup) {
    popup.classList.remove("open");
    // Wait for 1 sec, to let the animation do its work.
    await wait(1000);
    // remove it from the DOM
    popup.remove();
    // remove it from the javascript memory
    popup = null;
}

function ask(options) {
    //  Options object will have an attribute 
    //  with the question, 
    //  and the option for the a cancel button
    return new Promise(async function(resolve) {
        // First we need to create a popup with all the fields in it 

        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.insertAdjacentHTML('afterbegin',
            `<fieldset>
                <label>${options.title}<label>
                <input type="text" name="input">
                <button type="submit">Submit</button>
            </fieldset>
        `);

        // Check if they want a cancel button
        if (options.cancel) {
            const skipButton = document.createElement('button');
            skipButton.type = "button"; // so it doesn't submit
            skipButton.textContent = 'cancel';
            popup.firstElementChild.appendChild(skipButton);
            skipButton.addEventListener(
                'click',
                () => {
                    resolve(null);
                    destroyPopup(popup);
                }, { once: true }
            );
            // TODO: listen for a click on that cancel button 
        }

        popup.addEventListener(
            'submit',
            e => {
                e.preventDefault();
                //popup.input.value
                resolve(e.target.input.value);
            }, { once: true });


        // Listen for the submit event on the inputs

        // when someone does submit it, resolve the data that was in the input box.

        // Insert that popup in the DOM
        document.body.appendChild(popup);
        await wait(50);
        popup.classList.add('open');
    });
}

async function askQuestion(e) {
    const button = e.currentTarget;
    // return true if the attribute exist
    const cancel = 'cancel' in button.dataset;
    // const cancel = button.hasAttribute('data-cancel');
    const answer = await ask({
        title: button.dataset.question,
        cancel: cancel
    });

    console.log(answer);
}

const buttons = document.querySelectorAll('[data-question]');
buttons.forEach(button => button.addEventListener('click', askQuestion));

const questions = [
    { title: 'What is your name❔' },
    { title: 'What is your age❔', cancel: true },
    { title: 'What is your dog name❔' },
];

async function asyncMap(array, callback) {
    const results = [];
    for (const item of array) {
        results.push(await callback(item))
    }
    return results;
}

async function go() {
    const answers = await asyncMap(questions, ask);
    console.log(answers);
}

go();