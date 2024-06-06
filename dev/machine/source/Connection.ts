abstract class Connection {
    protected constructor() {};
    public static connecting_list: Record<string, int> = {};
    public static registerTrinket(id: int) {
        Connection.connecting_list[IDRegistry.getNameByID(id)] = id;
    }
}