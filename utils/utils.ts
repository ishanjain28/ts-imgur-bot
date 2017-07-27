export class Utils {
    /**
     * ObjectToArray
     */
    public ObjectToArray(obj : object) {
        return Array
            .prototype
            .slice
            .call(obj)
            .join("");

    }
}
