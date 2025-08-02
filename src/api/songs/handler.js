/* eslint-disable no-underscore-dangle */

const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // mem-bind nilai this untuk seluruh method sekaligus
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Musik berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;

    const songs = await this._service.getSongs({ title, performer });

    const response = h.response({
      status: 'success',
      message: 'Daftar musik berhasil diambil',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      message: 'Musik berhasil diambil',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongParams(request.params);
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    await this._service.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Musik berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    const response = h.response({
      status: 'success',
      message: 'Musik berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;
