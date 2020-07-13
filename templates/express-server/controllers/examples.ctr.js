// import model into controller
const Example = require('../models/Example.mdl');


// @desc    Get all examples
// @route   GET /api/v1/examples
// @access  Public
exports.getExamples = async (req, res, next) => {
  try {
    const examples = await Example.find();
    
    return res.status(200).json({
      sucess: true,
      count: examples.lenght,
      data: examples
    });
  } catch (err) {
    return res.status(500).json({
      sucess: false,
      error: 'Server Error'
    })
  }
}

// @desc    Get single example
// @route   GET /api/v1/examples/:id
// @access  Public
exports.getExample = async (req, res, next) => {
  try {
    const example = await Example.findById(req.params.id);
    
    if(!example || example === null) {
      return res.status(404).json({
        sucess: false,
        error: 'Example not found'
      });
    }

    return res.status(200).json({
      sucess: true,
      data: example
    });
  } catch (err) {
    return res.status(500).json({
      sucess: false,
      error: 'Server Error'
    });    
  }
}

// @desc    Create new example
// @route   POST /api/v1/examples/:id
// @access  Public
exports.createExample = async (req, res, next) => {
  try {
    const newExample = await Example.create(req.body);

    return res.status(201).json({
      sucess: true,
      data: newExample,
      message: "New example created"
    });
  } catch (err) {
    // get model object error messages if any
    if(err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(value => value.message);

      return res.status(400).json({
        sucess: false,
        error: messages
      });
    }
    return res.status(500).json({
      sucess: false,
      error: 'Server Error'
    });
  }
}

// @desc    Update single example
// @route   PUT /api/v1/examples/:id
// @access  Public
exports.updateExample = async (req, res, next) => {
  try {
    let example = await Example.findById(req.params.id);

    // if not exist or search param is null
    if(!example || example === null) {
      return res.satus(404).json({
        sucess: false,
        error: 'Example not found'
      });
    }
    
    const { exampleField, anotherField } = req.body;
    
    // check if the request body has a value, otherwise use database value
    const editExample = {
      exampleField: exampleField ? exampleField : example.exampleField,
      anotherField: anotherField ? anotherField : example.anotherField
    }

    await example.updateOne(editExample);

    // get example with the new data
    example = await Example.findById(req.params.id);

    return res.status(200).json({
      sucess: true,
      data: example,
      message: 'Example updated'
    });
  } catch (err) {
    return res.status(500).json({
      sucess: false,
      error: 'Server Error'
    });
  }
}

// @desc    Delete single example
// @route   DELETE /api/v1/examples/:id
// @access  Public
exports.deleteExample = async (req, res, next) => {
  try {
    const example = await Example.findById(req.params.id);
    
    // if not exist or search param is null
    if(!example || example === null) {
      return res.status(404).json({
        sucess: false,
        error: 'Example not found'
      })
    }

    await example.remove();

    return res.status(200).json({
      sucess: true,
      message: 'Example deleted'
    });
  } catch (err) {
    return res.status(500).json({
      sucess: false,
      error: 'Server Error'
    });
  }
}