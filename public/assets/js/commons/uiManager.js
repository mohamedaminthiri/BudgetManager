'use strict';

//neogenz.utilities.defineNamespace(app, 'ui.manager.modal');
//neogenz.utilities.defineNamespace(app, 'ui.messages');


(function init() {
    app.uiManager.formMode = {
        edit: 0,
        add: 1,
        create: 2
    };

    app.uiManager.messages = {
        signup: {
            passwordNotEquals: 'Les mots de passes ne corresponde pas.',
            success: 'Inscription effectué avec succès.',
            fail: 'Une erreur est survenue lors de l\'inscription.'
        }
    };
})();