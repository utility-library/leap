import {BasicFeature} from './basicFeature.js'
import luaparser from './leapparse.js';
import { codeToAst, formatAst, markAstLoc, markLoc } from '../functions/utils.js';
import AstToCode from "../functions/astToCode.js";

var ast = luaparser.ast
var generic = codeToAst(`
    (function()
        local __tab = {}

        for VARIABLES in ITERATORS do
            if CONDITIONS then
                __tab[STATEMENT_KEY] = STATEMENT_VALUE;
            end
        end

        return __tab
    end)()
`)


function generateTableInsert(tempTableIdentifier, statement, loc) {
    var table = markLoc(ast.identifier("table"), loc)
    var insert = markLoc(ast.identifier("insert"), loc)

    var memberExpression = markLoc(ast.memberExpression(table, ".", insert), loc)

    var callExpression = markLoc(ast.callExpression(memberExpression, [tempTableIdentifier, statement]), loc)
    var callStatement = markLoc(ast.callStatement(callExpression), loc)

    return callStatement
}

function generateCondition(conditions, loc) {
    if (conditions.length === 1) {
        // Length of conditions == 1 means no more binaryExpressions (return current condition)
        return conditions[0];
    } else {
        // Remove first condition (and store it)
        const leftCondition = conditions.shift();
        // Generate right condition (recursive call)
        const rightCondition = generateCondition(conditions, loc);

        // Return new binaryExpression with left and right conditions
        return markLoc(ast.binaryExpression('and', leftCondition, rightCondition), loc);
    }
}

class TableComprehension extends BasicFeature {
    shouldEdit(node, parent) {
        return node.type === "TableComprehensionStatement" 
    }
    edit(node, parent) {
        // Process key and value (for VARIABLES)
        var astToCode = new AstToCode(false);
        var genericFormatted = undefined;

        if (node.statements[1]) { // If there's 2 statements (so its a key and value and not an array like)
            var statementKey = astToCode.processAst(node.statements[0])
            var statementValue = astToCode.processAst(node.statements[1])

            genericFormatted = formatAst(generic, {
                name: {
                    STATEMENT_KEY: statementKey,
                    STATEMENT_VALUE: statementValue,
                }
            }, node.loc)
        } else {
            genericFormatted = structuredClone(generic)
            markAstLoc(genericFormatted, node.loc)
        }


        // Find the for statement
        var forGenericStatement = genericFormatted.expression.base.body[1]

        // Overwrite the variables and iterators
        forGenericStatement.variables = node.variables
        forGenericStatement.iterators = node.iterators
        

        var ifClause = forGenericStatement.body[0].clauses[0]

        // If the table comprehension have 1 statement its a table insert (array like)
        if (node.statements.length == 1) {
            var tempTableIdentifier = genericFormatted.expression.base.body[0].variables[0]
            var statement = node.statements[0]

            var table_insert = generateTableInsert(tempTableIdentifier, statement, node.loc)

            ifClause.body = [table_insert]
        }

        // If the table comprehension have 0 conditions
        if (node.conditions.length == 0) {
            // Set the body of the for as the body of the ifClause inside the if, doing so we remove the if (__tab[STATEMENT_KEY] = STATEMENT_VALUE)
            forGenericStatement.body = ifClause.body
        } else {
            // Set the condition of the ifClause inside the if
            ifClause.condition = generateCondition(node.conditions, node.loc)
        }

        // Replace the TableComprehensionStatement node with the generated one
        this.replace(genericFormatted)
    }
}

export {TableComprehension}
