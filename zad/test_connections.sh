echo "Sprawdzam połączenie frontend -> backend"
docker exec frontend curl -s backend:3000 || echo "brak połączenia frontend -> backend"

echo ""

echo "Sprawdzam połączenie backend -> database"
docker exec backend curl -s http://localhost:3000/db || echo "brak połączenia backend -> database"

echo ""

echo "Próba niedozwolonego połączenia frontend -> database (powinno się nie udać)"
docker exec frontend ping -c 1 database && echo "frontend NIE powinien widzieć bazy!" || echo "poprawnie zablokowane"