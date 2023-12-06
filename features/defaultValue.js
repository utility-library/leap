import {BasicFeature} from './basicFeature.js'
import {codeToAst, formatAst} from "../functions/utils.js";

var bakedAst = codeToAst(`
    if PARAM == nil then 
        PARAM = DEFAULT_VALUE
    end
`)

class DefaultValue extends BasicFeature {
    shouldEdit(node, parent) {
        return node.type === "DefaultParameterValue"
    }
    edit(node, parent) {
        var _ast = formatAst(bakedAst, {
            name: {
                PARAM: node.parameter.name,
                DEFAULT_VALUE: node.expression.raw
            },
        }, node.loc)

        parent.body.unshift(_ast) // add before the rest of the code

        // replace the "identifier with attribute" with only the basic "identifier" (in the function parameters)
        this.replace(node.parameter)
    }
}

export {DefaultValue}