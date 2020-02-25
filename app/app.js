let app = angular.module('noteApp', []);

app.directive('notepad', function (notesFactory) {
    return {
        restrict: 'AE',
        scope: {},
        link: function (scope, elem) {

            // Add a New Note
            scope.newNote = function () {
                scope.editMode = true;
                scope.noteText = undefined;
                scope.index = localStorage.length++;
            };

            // Edit a Existing Note
            scope.openEditor = function (index) {
                scope.editMode = true;
                if (index !== undefined) {
                    scope.noteText = notesFactory.get(index).content;
                    scope.index = index;
                } else
                    scope.noteText = undefined;
            };

            // Save a Note
            scope.save = function () {
                if (scope.noteText !== "" && scope.noteText !== undefined) {
                    let note = {};
                    note.title = scope.noteText.length > 10 ? scope.noteText.substring(0, 10) + '. . .' : scope.noteText;
                    note.content = scope.noteText;
                    note.id = scope.index !== -1 ? scope.index : localStorage.length;
                    scope.notes = notesFactory.put(note);
                }
                scope.restore();
            };

            scope.restore = function () {
                scope.editMode = false;
                scope.index = -1;
                scope.noteText = "";
            };

            let editor = elem.find('#editor');

            scope.restore();

            scope.notes = notesFactory.getAll();

            editor.bind('keyup keydown', function () {
                scope.noteText = editor.text().trim();
            });

        },
        templateUrl: 'views/templateurl.html'
    };
});

app.factory('notesFactory', function () {
    return {
        put: function (note) {
            localStorage.setItem('note' + note.id, JSON.stringify(note));
            return this.getAll();
        },
        get: function (index) {
            return JSON.parse(localStorage.getItem('note' + index));
        },
        getAll: function () {
            let notes = [];

            for (let i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).indexOf('note') !== -1) {
                    let note = localStorage.getItem(localStorage.key(i));
                    notes.push(JSON.parse(note));
                }
            }
            return notes;
        }
    };
});