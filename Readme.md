# Informacje podstawowe
## Projekt zaliczeniowy do przedmiotu Programowanie Backendowe: RESTAURACJA
## Autor: Bogumił Latuszek

# Przeznaczenie
 Aplikacja pozwala na zarządzanie personelem, magazynem produktów, stolikami, menu 
 oraz zamówieniami i generowanie raportów. Aplikacja umożliwia również rezerwację stolików

# Funkcjonalność
Zgodnie z wymaganiami opisanymi [tutaj](https://github.com/rbrzegowy/pab/blob/main/projekt%203%20-%20restauracja/projekt%20restauracja.md).

# Instrukcja
## Przygotowanie środowiska
* Instalacja MongoDB
   Postępuj zgodnie z instrukcją opisaną na: [instrukcja instalacji MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)
* Instalacja Node
    * Pobierz instalator ze [strony NodeJS](https://nodejs.org/en/)
    * Uruchom instalator i postępując zgodnie z instrukcjami instalatora zainstaluj Node
    * Zrestartuj komputer
* Sklonowanie kodu źródłowego
```
git clone git@github.com:bogumil-latuszek/projekt_zaliczeniowy_backend_restauracja.git
```
* Zainstalowanie wymaganych paczek npm
```
cd projekt_zaliczeniowy_backend_restauracja
npm install
```
# Uruchomienie testów
* Testy całej warstwy Data Access:
```
npm run test_data_access 
```
* Testy kolejnych endpointów
```
npm run test_ep_dishes 
npm run test_ep_employees 
npm run test_ep_products
npm run test_ep_restaurants 
npm run test_ep_reservations 
npm run test_ep_tables 
npm run test_ep_orders
```
# Uruchomienie aplikacji
```
npm start
```