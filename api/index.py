import sqlite3

conn = sqlite3.connect("trades.sqlite")

cur = conn.cursor()

query = """CREATE TABLE IF NOT EXISTS fills(
    order_id INT NOT NULL,
    fill_price DOUBLE NOT NULL,
    fill_quantity DOUBLE NOT NULL,
    side TEXT CHECK (side IN ('BUY', 'SELL')) NOT NULL,
    exchange TEXT NOT NULL,
    symbol TEXT NOT NULL,
    fees DOUBLE NOT NULL,
    timestamp DATETIME PRIMARY KEY)"""

# cur.execute(query)
# res = cur.execute("SELECT * FROM fills")

# for fill in cur.execute('SELECT COUNT(*) FROM fills;'):
#     print(fill)
    
print(list(cur.execute("SELECT COUNT(*) FROM fills WHERE symbol = 'BTC/USDT';")))    
conn.commit()
conn.close()