// Importar el modelo de Instrument
const Instrument = require('../models/Instrument');
const Platform = require('../models/Platform');

// Obtener todos los instrumentos
exports.getInstruments = async (req, res) => {
  try {
    const platforms = await Platform.find().select('nombre instruments'); // Trae solo el nombre y los instrumentos
    res.status(200).json(platforms);
  } catch (error) {
    console.error('Error al obtener instrumentos:', error);
    res.status(500).json({ message: 'Error al obtener instrumentos', error });
  }
};

// Obtener un instrumento por ID
exports.getInstrumentById = async (req, res) => {
  try {
    const instrument = await Instrument.findById(req.params.id).populate(
      'plataforma'
    );
    if (!instrument) {
      return res.status(404).json({ message: 'Instrumento no encontrado' });
    }
    res.status(200).json(instrument);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el instrumento', error });
  }
};

// Crear un nuevo instrumento
/*exports.createInstrument = async (req, res) => {
  const { plataforma, instrumentos } = req.body;

  // Procesa cada instrumento en el arreglo para aplicar el cálculo de GATNominal y GATReal
  const processedInstruments = instrumentos.map((instrument) => {
    // Calcular GAT Nominal y GAT Real
    const inflationRate = 0.038;
    const interesBrutoDecimal = instrument.interesBruto / 100;
    const diasCapitalizacion = 360; // Asumiendo que este valor es constante en tu contexto

    const GATNominal =
      Math.pow(
        1 + interesBrutoDecimal / diasCapitalizacion,
        diasCapitalizacion
      ) - 1;
    const GATReal = (1 + GATNominal) / (1 + inflationRate) - 1;

    return {
      plazo: instrument.plazo,
      interesBruto: instrument.interesBruto,
      GATNominal: (GATNominal * 100).toFixed(2),
      GATReal: (GATReal * 100).toFixed(2),
    };
  });

  try {
    const newInstrument = new Instrument({
      plataforma,
      instrumentos: processedInstruments, // Usa los datos procesados
    });

    await newInstrument.save();
    res.status(201).json(newInstrument);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear instrumento', error });
  }
};*/

// Controlador para crear un instrumento y vincularlo a una plataforma existente
exports.createInstrument = async (req, res) => {
  try {
    const { plataforma, plazo, interesBruto } = req.body;
    //console.log('Nombre de la plataforma recibida:', plataforma);

    // Buscar la plataforma por su nombre
    const platform = await Platform.findOne({ nombre: plataforma });

    // Verifica si instruments está definido y es un array
    if (!platform.instruments) {
      platform.instruments = [];
    }

    //console.log('Plataforma encontrada:', platform);

    // Calcular GAT Nominal y GAT Real
    const inflationRate = 0.038;
    const interesBrutoDecimal = interesBruto / 100;
    const diasCapitalizacion = 360;

    const GATNominal =
      Math.pow(
        1 + interesBrutoDecimal / diasCapitalizacion,
        diasCapitalizacion
      ) - 1;
    const GATReal = (1 + GATNominal) / (1 + inflationRate) - 1;
    //console.log('Cálculos GAT:', { GATNominal, GATReal });

    // Crear el nuevo instrumento
    const newInstrument = {
      plazo,
      interesBruto,
      GATNominal: (GATNominal * 100).toFixed(2),
      GATReal: (GATReal * 100).toFixed(2),
    };

    // Agregar el instrumento a la lista de instrumentos de la plataforma existente
    platform.instruments.push(newInstrument);

    // Guardar los cambios en la plataforma
    await platform.save();
    //console.log('Instrumento agregado con éxito:', newInstrument);

    res.status(201).json({ message: 'Instrumento agregado exitosamente.' });
  } catch (error) {
    //console.error('Error al crear el instrumento:', error); // Esto te mostrará detalles del error en la consola
    res.status(500).json({ message: 'Error al crear el instrumento', error });
  }
};

/* Para actualizar un instrumento específico dentro de una plataforma, 
utilizamos el Id y un índice o instrumentId dentro de los instrumentos*/
exports.updateInstrument = async (req, res) => {
  try {
    const { id, instrumentId } = req.params;
    const { plazo, interesBruto } = req.body;

    const platform = await Platform.findById(id);

    if (!platform) {
      return res.status(404).json({ message: 'Plataforma no encontrada' });
    }

    // Encontrar el instrumento en el array por su ID o índice
    const instrument = platform.instruments.id(instrumentId);

    if (!instrument) {
      return res
        .status(404)
        .json({ message: 'Instrumento no encontrado en la plataforma' });
    }

    // Actualizar los campos necesarios
    instrument.plazo = plazo;
    instrument.interesBruto = interesBruto;

    // Recalcular GAT Nominal y GAT Real
    const inflationRate = 0.038;
    const interesBrutoDecimal = instrument.interesBruto
      ? instrument.interesBruto / 100
      : 0;
    const diasCapitalizacion = 360;

    const GATNominal = interesBrutoDecimal
      ? Math.pow(
          1 + interesBrutoDecimal / diasCapitalizacion,
          diasCapitalizacion
        ) - 1
      : 0;
    const GATReal = GATNominal ? (1 + GATNominal) / (1 + inflationRate) - 1 : 0;

    instrument.GATNominal = (GATNominal * 100).toFixed(2);
    instrument.GATReal = (GATReal * 100).toFixed(2);

    // Guardar la plataforma con el instrumento actualizado
    await platform.save();

    res.status(200).json({ message: 'Instrumento actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el instrumento:', error);
    res
      .status(500)
      .json({ message: 'Error al actualizar el instrumento', error });
  }
};

// Eliminar un instrumento
exports.deleteInstrument = async (req, res) => {
  try {
    const { id, instrumentId } = req.params;

    // Encuentra la plataforma y elimina el instrumento del array de instrumentos
    const platform = await Platform.findById(id);
    if (!platform) {
      return res.status(404).json({ message: 'Plataforma no encontrada' });
    }

    // Encuentra el índice del instrumento y elimínalo del array
    const instrumentIndex = platform.instruments.findIndex(
      (inst) => inst._id.toString() === instrumentId
    );
    if (instrumentIndex === -1) {
      return res.status(404).json({ message: 'Instrumento no encontrado' });
    }

    platform.instruments.splice(instrumentIndex, 1); // Elimina el instrumento del array

    // Guarda los cambios en la plataforma
    await platform.save();

    res.status(200).json({ message: 'Instrumento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el instrumento:', error);
    res
      .status(500)
      .json({ message: 'Error al eliminar el instrumento', error });
  }
};
