class AstToCode {
    code = ""
    currentLine = 1

    addNewLine() {
        this.code += '\n';
    }

    // TODO: make it actually work
    calculateIndentation(node) {
        const startColumn = node.loc.start.column;
    
        if (startColumn > 1) {
            return (' ').repeat(startColumn);
        } else {
            return ''
        }
    }

    lineNeedsToBeCorrected(node, end) {
        if (!node) {
            throw new Error("lineNeedsToBeCorrected: node is null")
        }

        if (!node.loc || !node.loc.start || !node.loc.end) {
            throw new Error("lineNeedsToBeCorrected: node doesn't have loc, "+JSON.stringify(node))
            
        }

        let line = end ? node.loc.end.line : node.loc.start.line
        
        return line > this.currentLine
    }

    correctLineNumber(node, end) {
        let line = end ? node.loc.end.line : node.loc.start.line
        let lines = line - this.currentLine

        this.code += '\n'.repeat(lines);
        this.currentLine = line;
    }

    correctLineForConcatenation(node, end) {
        if (this.lineNeedsToBeCorrected(node, end)) {
            this.correctLineNumber(node, end)
        }
    }

    processNodes(nodes, separator = "") {
        if (nodes.length == 0) {
            return
        }

        nodes.forEach(node => {
            this.processNode(node); 

            if (separator.length > 0) {
                this.code += separator
            }
        })

        if (separator.length > 0) {
            this.code = this.code.slice(0, -separator.length); // remove last separator
        }
    }


    switchGeneral(node) {
        switch (node.type) {
            case 'Chunk':
                node.body.forEach(node => this.processNode(node));
                return true

            case "Identifier": case "Attribute":
                this.code += node.name
                return true

            case "IdentifierWithAttribute":
                this.processNode(node.name)
                this.code += " "
                this.code += "<"
                this.processNode(node.attribute)
                this.code += "> "

                return true

            case "StringLiteral": case "NumericLiteral": case "BooleanLiteral": case "NilLiteral": case "VarargLiteral": case "StringHashLiteral":
                this.code += node.raw
                return true

            case 'FunctionDeclaration':
                this.code += ` function ${node.identifier?.name || ""}(`
                this.processNodes(node.parameters, ", ")
                this.code += `) `;

                node.body.forEach(node => this.processNode(node));

                // Check if line needs to be corrected for the closing brace
                if (this.lineNeedsToBeCorrected(node, true)) {
                    this.correctLineNumber(node, true)
                }
                this.code += ' end ';
                return true

            default:
                return false
        }
    }

    switchExpressions(node) {
        switch (node.type) {
            case "MemberExpression":
                this.processNode(node.base)
                this.code += `${node.indexer}`;
                this.processNode(node.identifier)
                
                return true

            case "LogicalExpression": case "BinaryExpression":
                this.code += "("
                    this.processNode(node.left)
                    this.code += ` ${node.operator} `;
                    this.processNode(node.right)
                this.code += ")"
                
                return true

            case "UnaryExpression":
                this.code += `(`;
                this.code += `${node.operator} `
                this.processNode(node.argument);
                this.code += `)`;
                return true

            case "CallExpression":
                this.processNode(node.base);
                this.code += '('

                if (node.arguments.length > 0) {
                    this.processNodes(node.arguments, ", ");
                }

                this.code += ')';
                return true

            case "ArrowFunctionExpression":
                this.processNode(node.body);
                return true

            case "TableConstructorExpression":
                this.code += "{"
                
                if (node.fields.length > 0) {
                    var separator = ","
                    node.fields.forEach(field => {
                        switch (field.type) {
                            case "TableKey":
                                this.code += "["
                                this.processNode(field.key) 
                                this.code += "] = "
                                this.processNode(field.value)
    
                                break;
                            case "TableValue":
                                this.processNode(field.value);
                                break;
                            case "TableKeyString":
                                this.processNode(field.key)
                                this.code += " = "
                                this.processNode(field.value);
                        }
                        
                        this.code += separator
                    })
    
                    this.code = this.code.slice(0, -separator.length); // remove last separator    
                }

                // Check if line needs to be corrected for the closing brace
                this.correctLineForConcatenation(node, true)

                this.code += "}"
                return true

            case "TableCallExpression":
                this.processNode(node.base);
                this.processNode(node.arguments);
                return true

            case "StringCallExpression":
                this.processNode(node.base);
                this.processNode(node.argument);
                return true

            case "IndexExpression":
                this.processNode(node.base);
                this.code += '[';
                this.processNode(node.index);
                this.code += ']'
                return true

            default:
                return false
        }
    }

    switchStatements(node) {
        switch (node.type) {
            case 'CallStatement':
                this.processNode(node.expression);
                return true

            case 'LocalStatement':
                this.code += " local "
                this.processNodes(node.variables)

                this.code += " = ";
                node.init.forEach(node => this.processNode(node))
                this.code += ";"
                return true

            case "ClassStatement":
                this.code += " class "
                this.processNode(node.identifier)
                this.processNode(node.body)
                return true

            case "AssignmentStatement":
                this.processNodes(node.variables, ", ");
                this.code += ` = `;
                this.processNodes(node.init, ', ');
                this.code += ";";

                return true

            case "ArrowFunctionStatement":
                this.code += ` function(`
                this.processNodes(node.parameters, ", ")
                this.code += `) `;

                node.body.forEach(node => this.processNode(node));

                // Check if line needs to be corrected for the closing brace
                if (this.lineNeedsToBeCorrected(node, true)) {
                    this.correctLineNumber(node, true)
                }
                this.code += ' end ';
                return true

            case "CompoundAssignmentStatement":
                this.processNode(node.variable);
                this.code += ` ${node.operator} `;
                this.processNode(node.init);

                return true

            case "InStatement":
                this.code += "leap_in("
                this.processNode(node.left);
                this.code += ", ";

                if (node.right.type == "Identifier") {
                    this.processNode(node.right);
                    this.code += ")"
                } else {
                    switch (node.right.type) {
                        case "MemberExpression":
                            this.processNode(node.right.base)
                            this.code += ", ";
                            this.code += `"${node.right.identifier.name}"`; // process it as a string
                            break;
                        case "IndexExpression":
                            this.processNode(node.right.base)
                            this.code += ", ";
                            
                            this.processNode(node.right.index);
                            break;
                    }

                    this.code += ")"
                }

                return true

            case "IfStatement":
                this.processNodes(node.clauses);

                this.correctLineForConcatenation(node, true)
                this.code += " end;"
                return true

            case "IfClause": 
                this.code += " if "
                this.processNode(node.condition);
                this.code += " then "
                this.processNodes(node.body);
                return true

            case "ElseifClause":
                this.code += " elseif "
                this.processNode(node.condition);
                this.code += " then "
                this.processNodes(node.body);
                return true

            case "ElseClause":
                this.code += " else "
                this.processNodes(node.body);
                return true

            case "WhileStatement":
                this.code += " while "
                this.processNode(node.condition);
                this.code += " do "
                this.processNodes(node.body);

                // Check if line needs to be corrected for the end
                this.correctLineForConcatenation(node, true)
                this.code += " end;"
                return true

            case "DoStatement":
                this.code += " do "
                this.processNodes(node.body);
                

                // Check if line needs to be corrected for the end
                this.correctLineForConcatenation(node, true)
                this.code += " end;"
                return true

            case "ReturnStatement":
                this.code += " return "
                this.processNodes(node.arguments)
                this.code += ";"
                return true

            case "BreakStatement":
                this.code += "break;"
                return true

            case "UnpackStatement":
                if (node.variables) {
                  this.processNodes(node.variables, ",");
                  this.code += " in "
                  this.processNode(node.table);
                } else {
                  this.code += " table.unpack("
                  this.processNode(node.table);
                  this.code += ") "
                }
            
                return true

            case "RepeatStatement":
                this.code += " repeat "
                this.processNodes(node.body);
                this.code += " until "
                this.processNode(node.condition);
                return true

            case "ForGenericStatement":
                this.code += " for "
                this.processNodes(node.variables, ",")
                this.code += " in "
                this.processNodes(node.iterators)
                this.code += " do "
                this.processNodes(node.body);

                // Check if line needs to be corrected for the end
                this.correctLineForConcatenation(node, true)
                this.code += " end;"
                return true

            case "ForNumericStatement":
                this.code += " for "
                this.processNode(node.variable)
                this.code += " = "
                this.processNode(node.start)
                this.code += ", "
                this.processNode(node.end)
                this.code += " do "
                this.processNodes(node.body);

                // Check if line needs to be corrected for the end
                this.correctLineForConcatenation(node, true)
                this.code += " end;"
                return true

            case "LabelStatement":
                this.code += "::"
                this.processNode(node.label)
                this.code += "::"
                return true

            case "GotoStatement":
                this.code += " goto "
                this.processNode(node.label)
                return true

            default:
                return false
        }
    }

    processNode(node) {
        //const indentation = this.calculateIndentation(node);

        if (this.lineNeedsToBeCorrected(node)) {
            this.correctLineNumber(node)
        }

        //console.log("Processing", node)

        let found = false

        found = this.switchGeneral(node)
        if (found) {this.currentLine = node.loc.end.line; return}
        
        found = this.switchExpressions(node)
        if (found) {this.currentLine = node.loc.end.line; return}
        
        found = this.switchStatements(node)
        if (found) {this.currentLine = node.loc.end.line; return}

        console.log(node)
        throw new Error("Unhandled node type: " + node.type)
    }

    processAst = async function(ast) {
        
        await this.processNode(ast)
        return this.code
    }
}

export default AstToCode