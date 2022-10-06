const mongoose = require('mongoose');

const Note = require('../models/note');
const User = require('../models/user');
const HttpError = require('../models/http-error');

exports.getNotes = async (req, res, next) => {
  const { userId } = req.userData;

  let notes;
  try {
    notes = await Note.find({ userId });
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de date. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: notes.map((note) => note.toObject({ getters: true })) });
};

exports.saveNote = async (req, res, next) => {
  const { userId } = req.userData;
  const { note } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de date. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  if (!user) {
    return next(new HttpError('Utilizatorul nu a putut fi găsit.', 500));
  }

  const newNote = new Note({
    userId,
    note,
  });
  user.notes.push(newNote);

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await user.save({ session });
    await newNote.save({ session });
    session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la salvarea notelor. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: newNote.toObject({ getters: true }) });
};

exports.removeNote = async (req, res, next) => {
  const { noteId } = req.params;

  let note;
  try {
    note = await Note.findById(noteId).populate('userId');
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de date. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await note.remove({ session });
    note.userId.notes.pull(note);
    await note.userId.save({ session });
    session.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        'A survenit o problemă la stergerea notelor. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  let notes;
  try {
    notes = await Note.find({ userId: note.userId._id });
  } catch (error) {
    return next(
      new HttpError(
        'A survenit o problemă la interogarea bazei de date. Vă rugăm să reîncercați.',
        500
      )
    );
  }

  res.json({ message: notes.map((note) => note.toObject({ getters: true })) });
};
