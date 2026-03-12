<?php

namespace App\Domain\Personal\Barberos\Services;

use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Personal\Barberos\Repositories\Contracts\BarberoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BarberoService
{
    public function __construct(
        protected BarberoRepositoryInterface $barberoRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->barberoRepository->findAll();
    }

    public function getById(string $id): ?Barbero
    {
        return $this->barberoRepository->findById($id);
    }

    public function create(array $data): Barbero
    {
        return DB::transaction(function () use ($data) {
            $avatarPath = $this->storePhoto($data['foto'] ?? null);

            $user = User::create([
                'name' => $data['nombre'],
                'email' => $data['email'],
                'password' => $data['cedula'],
                'avatar' => $avatarPath,
            ]);

            unset($data['foto']);

            return $this->barberoRepository->create([
                ...$data,
                'user_id' => $user->id,
                'foto_path' => $avatarPath,
            ]);
        });
    }

    public function update(string $id, array $data): bool
    {
        return DB::transaction(function () use ($id, $data) {
            $barbero = $this->barberoRepository->findById($id);

            if (! $barbero) {
                return false;
            }

            $avatarPath = $barbero->foto_path;
            $oldAvatarPath = $barbero->foto_path;

            if (($data['foto'] ?? null) instanceof UploadedFile) {
                $avatarPath = $this->storePhoto($data['foto']);
            }

            $user = $barbero->user;

            if (! $user) {
                $user = User::create([
                    'name' => $data['nombre'],
                    'email' => $data['email'],
                    'password' => $data['cedula'],
                    'avatar' => $avatarPath,
                ]);
            } else {
                $user->update([
                    'name' => $data['nombre'],
                    'email' => $data['email'],
                    'avatar' => $avatarPath,
                ]);
            }

            unset($data['foto']);

            $updated = $this->barberoRepository->update($id, [
                ...$data,
                'user_id' => $user->id,
                'foto_path' => $avatarPath,
            ]);

            if ($updated && $oldAvatarPath && $oldAvatarPath !== $avatarPath) {
                Storage::disk('public')->delete($oldAvatarPath);
            }

            return $updated;
        });
    }

    public function delete(string $id): bool
    {
        return $this->barberoRepository->delete($id);
    }

    protected function storePhoto(?UploadedFile $photo): ?string
    {
        if (! $photo) {
            return null;
        }

        return $photo->store('barberos', 'public');
    }
}
