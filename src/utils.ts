interface IVertex {
    id: string| number;
    type?: string;
}

/**
 * Retruns a uid string for a vertex.
 * @Note: Can not stringify {id: ..., type: ...} since order is not
 *        gurenteed in this case and we need the order to be fixed to
 *        confirm uniqueness. ex: { id 1, type: null } and
 *        { type: null, id: 1 } should refer to the same object.
 */
export function get_vertex_uid(vertex: IVertex): string {
    const id = vertex.id;
    const type = vertex.type;
    const last = RegExp("}([^}]*)$"); // find last occurrence of '{'
    const idStr = JSON.stringify({ i: id }).replace(last, ",$1");
    const vertexType = type === undefined ? null : type;
    const typeStr = JSON.stringify({ t: vertexType });
    return idStr + typeStr.substring(1);
}

/**
 * Retruns a uid string for a parameter in a vertex.
 * @Note: Can not stringify {id: ..., type: ...} since order is not
 *        gurenteed in this case and we need the order to be fixed to
 *        confirm uniqueness. ex: { id 1, type: null } and
 *        { type: null, id: 1 } should refer to the same object.
 */
export function get_parameter_uid(vertex: IVertex, parameter: string): string {
    const id = vertex.id;
    const type = vertex.type;
    const last = RegExp("}([^}]*)$"); // find last occurrence of '{'
    const idStr = JSON.stringify({ i: id }).replace(last, ",$1");
    const vertexType = type === undefined ? null : type;
    const typeStr = JSON.stringify({ t: vertexType }).replace(last, ",$1");
    const parameterStr = JSON.stringify({ p: parameter });
    return idStr + typeStr.substring(1) + parameterStr.substring(1);
}
