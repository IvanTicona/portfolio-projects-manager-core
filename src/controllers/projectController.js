const Project = require('../models/Project');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.getAll = async (req, res) => {
  try {
    await req.user.populate({
      path: 'projects',
      options: { sort: { createdAt: -1 } }
    });
    res.json(req.user.projects);
  } catch {
    res.status(500).json({ msg: 'Error al obtener proyectos' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    await req.user.populate('projects');
    const project = req.user.projects.find(p => p._id.toString() === id);
    if (!project) return res.status(404).json({ msg: 'Proyecto no encontrado' });

    res.json(project);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ msg: 'ID de proyecto inválido' });
    res.status(500).json({ msg: 'Error al obtener proyecto' });
  }
}

exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = { public_id: req.file.filename, url: req.file.path };

    const project = await Project.create(data);

    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id }
    });

    return res.status(201).json(project);
  } catch {
    res.status(500).json({ msg: 'Error al crear proyecto' });
  }
};

exports.update = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Proyecto no encontrado' });

    if (project._id && !req.user.projects.includes(project._id)) return res.status(403).json({ msg: 'No autorizado' });

    if (req.body.removeImage && project.image?.public_id) {
      await cloudinary.uploader.destroy(project.image.public_id);
      project.image = undefined;
    }
    if (req.file) {
      if (project.image?.public_id) await cloudinary.uploader.destroy(project.image.public_id);
      
      project.image = { public_id: req.file.filename, url: req.file.path };
    }

    Object.assign(project, req.body);
    await project.save();
    return res.json(project);
  } catch {
    res.status(500).json({ msg: 'Error al actualizar proyecto' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ msg: 'Proyecto no encontrado' });

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { projects: project._id }
    });

    if (project.image?.public_id) await cloudinary.uploader.destroy(project.image.public_id);

    return res.json({ msg: 'Proyecto eliminado' });
  } catch {
    res.status(500).json({ msg: 'Error al eliminar proyecto' });
  }
};
