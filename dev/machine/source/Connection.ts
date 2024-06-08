interface IConnectedTrinket {
    source: boolean,
    min: int,
    max: int
};

abstract class Connection {
    protected constructor() {};
    protected static connecting_list: Record<int, IConnectedTrinket> = {};
    public static registerTo(trinket: int, min: int, max: int, source = false) {
        this.connecting_list[trinket] = {min, max, source} satisfies IConnectedTrinket;
    };
    public static hasSource(trinket: int) {
       return Connection?.connecting_list[trinket]?.source === true
    };
    public static getStrength(trinket: int) {
        const trink = Connection.connecting_list[trinket]
        if(!trink) return null;
        return {
            min: trink.min,
            max: trink.max
        }
    };
    
}
