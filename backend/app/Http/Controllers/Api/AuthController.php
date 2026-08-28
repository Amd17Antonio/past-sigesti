<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'usuario' => 'required|string',
            'clave'   => 'required|string',
        ]);

        $usuario = Usuario::where('usuario', $credentials['usuario'])->first();

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 401);
        }

        $statusRaw = $usuario->status;
        $statusActivo = $statusRaw == 1 || $statusRaw === "\x01" || $statusRaw === true;

        if (!$statusActivo) {
            return response()->json([
                'message' => 'Usuario inactivo'
            ], 401);
        }

        if (!Hash::check($credentials['clave'], $usuario->clave)) {
            return response()->json([
                'message' => 'Contraseña incorrecta'
            ], 401);
        }

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'usuario' => $usuario->load('rol', 'area'),
            'token'   => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function me(Request $request)
    {
        return response()->json(
            $request->user()->load('rol', 'area', 'soporte')
        );
    }
}