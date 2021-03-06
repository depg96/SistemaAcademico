﻿(function () {
    // Getting the Context Module
    angular.module("SisAcademicoPA")
    // Addig the  controller function
    // to the context module
    .controller('PeriodDetailsController', PeriodDetailsController);
    PeriodDetailsController.$inject = ['$scope', '$http', '$routeParams'];
    function PeriodDetailsController($scope, $http, $routeParams) {
        $scope.periodID = $routeParams.periodID;
        $scope.query = "";
        $scope.queryResults = {};
        $scope.fetchAsignaturas = () => {
            $http.get('/api/Asignatures/fetchAsignaturas?query=' + $scope.query).then(function (data) {
                console.log(data.data);
                $scope.Asignaturas = data.data;
            });
        }
        $http.get('/api/Rooms/').then(function (data) {
            console.log(data.data);
            $scope.Rooms = data.data;
            //
            var Rooms = [];
            Rooms.push('<option disabled selected hidden"> - Seleccionar - </option>')
            $.each($scope.Rooms, function (index, val) {
                console.log(index); console.log(val);
                var option = '<option value="' + val.roomID + '">' + val.building + '-' + val.roomNumber + '</option>';
                Rooms.push(option);
            });
            Rooms = Rooms.join('');
            console.log(Rooms);
            $('#AulaSelect').html(Rooms);
            //
        });
        $scope.inscribirAsig = function () {
            $http.post('/api/SeccionesDePeriodos/PostSeccion/', { PeriodID: $scope.periodID, TeacherID: $('#teachersSelect').val(), AsignatureID: $scope.currAsignature.id })
            .then(function (data, status, headers, config) {
                swal('¡Listo!', 'Todos los cambios han sido guardados.', 'success'); $scope.fetch();
            });
        }
        $scope.concluir = function () {
            swal({
                title: '¿¡Estás seguro!?',
                text: "Concluir el período afectará a todas las asignaturas inscritas en el, esta acción no puede ser revertida.",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar'
            }).then(function () {
                $http.put('/api/Periodos/conclude?id=' + $routeParams.periodID).then(function () {
                    swal('¡Listo!', 'Todos los cambios han sido guardados.', 'success'); $scope.fetch();
                });
            })
        }
        $scope.setAsignature = function (asignature) {
            console.log(asignature);
            $scope.currAsignature = asignature;
            $http.get('/api/TeachersAsignatures/getAsignatureTeachers/' + $scope.currAsignature.id).then(function (data) {
                $scope.currAsignature.Teachers = data.data;
                //
                var teachers = [];
                teachers.push('<option disabled selected hidden"> - Seleccionar - </option>')
                $.each($scope.currAsignature.Teachers, function (index, val) {
                    var option = '<option value="' + val.userId + '">' + val.name + ' ' + val.name2 + ' ' + val.lastName + '</option>';
                    teachers.push(option);
                });
                teachers = teachers.join('');
                $('#teachersSelect').html(teachers);
                //
            });
        }
        $scope.fetch = function () {
            console.log("PPP");
            console.log($scope.periodID);
            $http.get('/api/Periodos/getPeriodDetails?id=' + $scope.periodID).then(function (data) {
                $scope.currperiod = data.data;
                console.log("Pdet");
                console.log($scope.currperiod)
            });
        }
        $scope.fetch();
    }
}());