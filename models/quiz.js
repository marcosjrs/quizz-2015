//Definicion del model. Constructor de objetos (como VO)

module.exports = function(sequelize, DataTypes) {

	return sequelize.define('Quiz',{
								pregunta:DataTypes.STRING,
								respuesta:DataTypes.STRING 
							}); // pregunta y respuesta son todos los campos de la tabla y son de tipo String

};