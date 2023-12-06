import {BasicFeature} from './basicFeature.js'
import {codeToAst, formatAst} from "../functions/utils.js";
import { DefaultValue } from './defaultValue.js';

var bakedAst = codeToAst(`
    if type(PARAM) ~= "TYPE" then
        if _G[PARAM] and type(_G[PARAM]) == "table" and _G[PARAM].__prototype then
            if not leap or not leap.deserialize then
                error("leap.deserialize not found, make sure you have some class loaded", 2)
            end

            PARAM = leap.deserialize(PARAM)
        else
            error("PARAM_NAME: TYPE expected, got " .. type(PARAM))
        end
    end
`)


class TypeChecking extends BasicFeature {
    shouldEdit(node, parent) {
        return node.type === "IdentifierWithTypeAttribute"
    }
    edit(node, parent) {
        var _ast;

        if (node.name.type == "DefaultParameterValue") {
            _ast = formatAst(bakedAst, {
                name: {
                    PARAM: node.name.parameter.name
                },
                raw: {
                    PARAM_NAME: node.name.parameter.name,
                    TYPE: node.attribute.name,
                }
            }, node.loc)

            parent.body.unshift(_ast) // add type checking before (default value is going to unshift and therefore end up being first)

            var defaultValue = new DefaultValue()
            defaultValue.edit.call(this, node.name, parent)
        } else {
            _ast = formatAst(bakedAst, {
                name: {
                    PARAM: node.name.name
                },
                raw: {
                    PARAM_NAME: node.name.name,
                    TYPE: node.attribute.name,
                }
            }, node.loc)

            // replace the "identifier with attribute" with only the basic "identifier" (in the function parameters)
            this.replace(node.name)
            parent.body.unshift(_ast) // add before the rest of the code
        }
    }
}

export {TypeChecking}