import Transformer from 'classes/transformers/Transformer';
import babel from 'babel';

class BabelTransformer extends Transformer {
	transform (input) {
		const result = babel.transform(input);
		const output = result.code;
		return output;
	}
}

export default BabelTransformer;
