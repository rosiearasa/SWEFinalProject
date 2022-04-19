package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void addItemButtonClick(View v) {
        Intent intent = new Intent(this, AddItemActivity.class);
        startActivity(intent);
    }

    public void registerUserButtonClick(View v) {
        Intent intent = new Intent (this, RegisterUserFragment.class);
        startActivity(intent);
    }

    public void deleteItemButtonClick(View v) {
        Intent intent = new Intent(this, AddItemActivity.class);
        startActivity(intent);
    }

    public void seeItemsButtonClick(View v) {
        Intent intent = new Intent(this, SeeItemsActivity.class);
        startActivity(intent);
    }

}