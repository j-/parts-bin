import Transformer from 'classes/transformers/Transformer';
import babel from 'babel';

class BabelTransformer extends Transformer {
	transform (input) {
		var result = babel.transform(input);
		var output = result.code;
		return output;
	}
};

export default BabelTransformer;
